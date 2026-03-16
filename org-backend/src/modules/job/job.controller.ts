import { Request, Response } from "express";
import { updateJobData, deleteJob, updateExistingJobStatus, fetchJobById, fetchAllJobs, createNewJob } from "./job.service.js";
import { createJobSchema, updateJobStatusSchema } from "./job.schema.js";

export const getJobs = async (req: Request, res: Response) => {
  try {
    const isAdmin = !!req.userId || req.query.adminView === 'true'; 
    
    const jobs = await fetchAllJobs(isAdmin);
    res.status(200).json({ 
      success: true, 
      data: jobs 
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const createJob = async (req: Request, res: Response) => {
  try {
    const parsed = createJobSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ 
        success: false, 
        errors: parsed.error
      });
    }

    const job = await createNewJob(parsed.data);
    res.status(201).json({ 
      success: true, 
      data: job
     });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const getSingleJob = async (req: Request, res: Response) => {
  try {
    const job = await fetchJobById(Number(req.params.id));
    if (!job) return res.status(404).json({ 
      success: false, 
      message: "Job not found" 
    });
    res.json({ 
      success: true, 
      data: job 
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const changeJobStatus = async (req: Request, res: Response) => {
  try {
    const parsed = updateJobStatusSchema.safeParse(req.body);
    if (!parsed.success){
      return res.status(400).json({ 
        success: false, 
        errors: parsed.error
      });
    }
    const updated = await updateExistingJobStatus(Number(req.params.id), parsed.data.status);
    res.json({ 
      success: true, 
      data: updated 
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const updateJob = async (req: Request, res: Response) => {
  try {
    const parsed = createJobSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ 
       success: false,
       errors: parsed.error.format() 
      });
    }
    
    const updated = await updateJobData(Number(req.params.id), parsed.data);
    res.json({
       success: true, 
       data: updated 
      });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const removeJob = async (req: Request, res: Response) => {
  try {
    await deleteJob(Number(req.params.id));
    res.json({ 
      success: true, 
      message: "Job deleted successfully" 
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};