import { Request, Response } from "express";
import path from "path";
import { updateAppStatus, fetchApplicationById, fetchAllApplications, createApplication } from "./application.service.js";
import { applyJobSchema, updateApplicationStatusSchema } from "./application.schema.js";
import Job from "../job/job.model.js";
import { sendApplicationMail } from "../../lib/mailer.js";
import { sendStatusUpdateMail } from "../../lib/mailer.js";
import { getStorageProvider } from "../../lib/storage/storageSwitchService.js";
import { getStorageByName } from "../../lib/storage/storageSwitchService.js";
import { parseResumeFromBuffer } from "../../lib/aiParser.js";
import { logger } from "../../utils/logger.js";

export const submitApplication = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      logger.warn("Application submission failed: No resume file provided");
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    const provider = process.env.STORAGE_PROVIDER!;
    const storage = getStorageProvider();
    const resumeUrl = await storage.upload(req.file);

    const formattedData = {
      ...req.body,
      jobId: Number(req.body.jobId),
      noticePeriod: Number(req.body.noticePeriod),
      resumeUrl,
      storageProvider: provider,
      experienceDetails: req.body.experienceDetails
        ? JSON.parse(req.body.experienceDetails)
        : [],
      educationDetails: req.body.educationDetails
        ? JSON.parse(req.body.educationDetails)
        : [],
    };

    const parsed = applyJobSchema.safeParse(formattedData);

    if (!parsed.success) {
      logger.warn("Application validation failed", { errors: parsed.error.format() });
      return res.status(400).json({
        success: false,
        errors: parsed.error.format(),
      });
    }

    const application = await createApplication(parsed.data);
    const job = await Job.findByPk(application.jobId);

    await sendApplicationMail(
      application.email,
      application.firstName,
      job?.title || "the position"
    );

    logger.info("Application submitted successfully", { 
      applicationId: application.id, 
      email: application.email 
    });

    return res.status(201).json({
      success: true,
      data: application,
    });

  } catch (error: any) {
    logger.error("APPLICATION ERROR:", { message: error.message, stack: error.stack });
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getApplications = async (_req: Request, res: Response) => {
  try {
    const data = await fetchAllApplications();
    logger.info("Fetched all applications", { count: data.length });
    res.status(200).json({
      success: true,
      data
    });
  } catch (error: any) {
    logger.error("Failed to fetch applications", { error: error.message });
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const downloadResume = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const app = await fetchApplicationById(Number(id));

    if (!app || !app.resumeUrl) {
      logger.warn(`Resume download failed: Not found for ID ${id}`);
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    const storage = getStorageByName(app.storageProvider);
    const stream = await storage.streamFile(app.resumeUrl);
    const fileName = path.basename(app.resumeUrl) || "resume.pdf";

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    stream.on("error", (error) => {
      logger.error("Stream error during download", { id, error: error.message });
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: "Error downloading file" });
      } else {
        res.end();
      }
    });

    logger.info(`Resume download started`, { applicationId: id });
    stream.pipe(res);

  } catch (error: any) {
    logger.error("Download error:", { id, error: error.message });
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export const previewResume = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const app = await fetchApplicationById(Number(id));

    if (!app || !app.resumeUrl) {
      logger.warn(`Resume preview failed: Not found for ID ${id}`);
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    const storage = getStorageByName(app.storageProvider);
    const stream = await storage.streamFile(app.resumeUrl);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="resume.pdf"`);

    stream.on("error", (error) => {
      logger.error("Stream error during preview", { id, error: error.message });
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: "Error previewing file" });
      } else {
        res.end();
      }
    });

    logger.info(`Resume preview requested`, { applicationId: id });
    stream.pipe(res);

  } catch (error: any) {
    logger.error("Preview error:", { id, error: error.message });
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const parsed = updateApplicationStatusSchema.safeParse(req.body);
    if (!parsed.success) {
        logger.warn("Status update validation failed", { errors: parsed.error.format() });
        return res.status(400).json(parsed.error);
    }

    const updated = await updateAppStatus(Number(id), parsed.data.status);
    const app = await fetchApplicationById(Number(id));

    if (app && (parsed.data.status === "Rejected" || parsed.data.status === "Offered")) {
      const job = await Job.findByPk(app.jobId);
      await sendStatusUpdateMail(
        app.email,
        app.firstName,
        job?.title || "the position",
        parsed.data.status
      );
    }

    logger.info("Application status updated", { applicationId: id, newStatus: parsed.data.status });

    res.json({
      success: true,
      data: updated
    });
  } catch (error: any) {
    logger.error("Failed to update application status", { id, error: error.message });
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const parseResume = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      logger.warn("Resume parsing failed: No file uploaded");
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required",
      });
    }

    const data = await parseResumeFromBuffer(req.file.buffer);
    
    logger.info("Resume parsed successfully using buffer");
console.log(" Resume API HIT");
    return res.status(200).json({
      success: true,
      data,
    });

  } catch (error: any) {
    logger.error("Resume parse error:", { error: error.message });
    return res.status(500).json({
      success: false,
      message: error?.message || "Unexpected error while parsing resume",
    });
  }
};