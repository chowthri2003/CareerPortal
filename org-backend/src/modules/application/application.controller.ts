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

export const submitApplication = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
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

    return res.status(201).json({
      success: true,
      data: application,
    });

  } catch (error: any) {
    console.error("APPLICATION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getApplications = async (_req: Request, res: Response) => {
  try {
    const data = await fetchAllApplications();
    res.status(200).json({
      success: true,
      data
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const downloadResume = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const app = await fetchApplicationById(id);

    if (!app || !app.resumeUrl) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    const storage = getStorageByName(app.storageProvider);
    const stream = await storage.streamFile(app.resumeUrl);

    const fileName = path.basename(app.resumeUrl) || "resume.pdf";

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    stream.on("error", (error) => {
      console.error("Stream error during download:", error);
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: "Error downloading file" });
      } else {
        res.end();
      }
    });

    stream.pipe(res);

  } catch (error: any) {
    console.error("Download error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export const previewResume = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const app = await fetchApplicationById(id);

    if (!app || !app.resumeUrl) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    const storage = getStorageByName(app.storageProvider);
    const stream = await storage.streamFile(app.resumeUrl);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="resume.pdf"`);

    stream.on("error", (error) => {
      console.error("Stream error during preview:", error);
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: "Error previewing file" });
      } else {
        res.end();
      }
    });

    stream.pipe(res);

  } catch (error: any) {
    console.error("Preview error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const parsed = updateApplicationStatusSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const updated = await updateAppStatus(
      Number(req.params.id),
      parsed.data.status
    );

    const app = await fetchApplicationById(Number(req.params.id));

    if (app && (parsed.data.status === "Rejected" || parsed.data.status === "Offered")) {
      const job = await Job.findByPk(app.jobId);
      await sendStatusUpdateMail(
        app.email,
        app.firstName,
        job?.title || "the position",
        parsed.data.status
      );
    }

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

export const parseResume = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required",
      });
    }

    const data = await parseResumeFromBuffer(req.file.buffer);

    return res.status(200).json({
      success: true,
      data,
    });

  } catch (error: any) {
    console.error("Resume parse error:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Unexpected error while parsing resume",
    });
  }
};