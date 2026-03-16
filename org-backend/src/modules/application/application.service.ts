import Application from "./application.model.js";
import Job from "../job/job.model.js";

export const createApplication = async (data: any) => {
  return await Application.create(data);
};

export const fetchAllApplications = async () => {
  return await Application.findAll( {
    include: [{ 
      model: Job, 
      as: "job",
      attributes: ["title", "location","jobType"]
     }],
  });
};

export const fetchApplicationById = async (id: number) => {
  return await Application.findByPk(id, {
    include: [{ 
      model: Job, 
      as: "job",
      attributes: ["title", "location","jobType"]
     }],
  });
};

export const updateAppStatus = async (id: number, status: string) => {
  const app = await Application.findByPk(id);
  if (!app) throw new Error("Application not found");
  return await app.update({ status: status as any });
};