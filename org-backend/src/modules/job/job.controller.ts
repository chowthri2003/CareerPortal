import { Request, Response } from "express";
import { updateJobData, deleteJob, updateExistingJobStatus, fetchJobById, fetchAllJobs, createNewJob } from "./job.service.js";
import { createJobSchema, updateJobStatusSchema } from "./job.schema.js";
import { logger } from "../../utils/logger.js";
import { redisclient } from "../../config/redis.config.js";

export const getJobs = async (req: Request, res: Response) => {
  try {
    const isAdmin = !!req.userId || req.query.adminView === 'true'; 
     const cacheKey = `career-portal:cache:jobs:${isAdmin ? "admin" : "public"}`;

    const cached = await redisclient.get(cacheKey);

    if (cached) {
      console.log("CACHE HIT");
      logger.info("Jobs fetched from cache", { isAdmin });
      return res.status(200).json({
        success: true,
        data: JSON.parse(cached),
        source: "cache", 
      });
    }
      console.log("CACHE MISS");
    const jobs = await fetchAllJobs(isAdmin);
    await redisclient.set(cacheKey, JSON.stringify(jobs), "EX", 60);
    logger.info("Successfully fetched all jobs", { count: jobs.length, adminView: isAdmin });

    res.status(200).json({ 
      success: true, 
      data: jobs,
      source: "db",
    });
  } catch (error: any) {
    logger.error("Failed to fetch jobs", 
      { message: error.message, 
        stack: error.stack 
      });

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createJob = async (req: Request, res: Response) => {
  try {
    const parsed = createJobSchema.safeParse(req.body);
    if (!parsed.success) {
      logger.warn("Job creation validation failed", { errors: parsed.error.format() });
      return res.status(400).json({ 
        success: false, 
        errors: parsed.error
      });
    }

    const job = await createNewJob(parsed.data);
    await redisclient.del("career-portal:cache:jobs:admin");
    await redisclient.del("career-portal:cache:jobs:public");

    logger.info("New job created successfully", { jobId: job.id });

    res.status(201).json({ 
      success: true, 
      data: job
     });
  } catch (error: any) {
    logger.error("Error creating job", { message: error.message, body: req.body });
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const getSingleJob = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cacheKey = `career-portal:cache:job:${id}`; 
  try {
    const cached = await redisclient.get(cacheKey);

    if (cached) {
      console.log("⚡ SINGLE JOB CACHE HIT");
      return res.json({
        success: true,
        data: JSON.parse(cached),
        source: "cache",
      });
    }
    console.log("🐢 SINGLE JOB CACHE MISS");
    const job = await fetchJobById(Number(id));
    if (!job) {
      logger.warn(`Job not found with ID: ${id}`);
      return res.status(404).json({ 
        success: false, 
        message: "Job not found" 
      });
    }
    await redisclient.set(cacheKey, JSON.stringify(job), "EX", 60);
    logger.info(`Successfully retrieved job details`, { jobId: id });
    res.json({ 
      success: true, 
      data: job 
    });
  } catch (error: any) {
    logger.error(`Error fetching job with ID: ${id}`, { error: error.message });
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const changeJobStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const parsed = updateJobStatusSchema.safeParse(req.body);
    if (!parsed.success){
      return res.status(400).json({ 
        success: false, 
        errors: parsed.error
      });
    }

    const updated = await updateExistingJobStatus(Number(id), parsed.data.status);
    
    await redisclient.del(`career-portal:cache:job:${id}`);
    await redisclient.del("career-portal:cache:jobs:admin");
    await redisclient.del("career-portal:cache:jobs:public");
    logger.info(`Job status updated`, { jobId: id, newStatus: parsed.data.status });

    res.json({ 
      success: true, 
      data: updated,
      postedDate: updated.postedAt
    });
  } catch (error: any) {
    logger.error(`Failed to update job status for ID: ${id}`, { error: error.message });
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const updateJob = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const parsed = createJobSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ 
       success: false,
       errors: parsed.error.format() 
      });
    }
    
    const updated = await updateJobData(Number(id), parsed.data);

    await redisclient.del(`career-portal:cache:job:${id}`);
    await redisclient.del("career-portal:cache:jobs:admin");
    await redisclient.del("career-portal:cache:jobs:public");
    
    logger.info(`Job details updated successfully`, { jobId: id });

    res.json({
       success: true, 
       data: updated 
      });
  } catch (error: any) {
    logger.error(`Error updating job ID: ${id}`, { error: error.message });
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const removeJob = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteJob(Number(id));
    await redisclient.del(`career-portal:cache:job:${id}`);
    await redisclient.del("career-portal:cache:jobs:admin");
    await redisclient.del("career-portal:cache:jobs:public");
    
    logger.info(`Job deleted successfully`, { jobId: id });

    res.json({ 
      success: true, 
      message: "Job deleted successfully" 
    });
  } catch (error: any) {
    logger.error(`Error deleting job ID: ${id}`, { error: error.message });
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};