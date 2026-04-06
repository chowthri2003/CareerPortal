import Job from "./job.model.js";
import { CreateJobInput } from "./job.schema.js";

export const createNewJob = async (data: CreateJobInput) => {
  return await Job.create(data as any);
};

export const fetchAllJobs = async (isAdmin: boolean = false) => {
  const whereClause = isAdmin ? {} : { status: "Posted" };

  return await Job.findAll({
    where: whereClause,
    order: [["createdAt", "DESC"]],
  });
};

export const fetchJobById = async (id: number) => {
  return await Job.findByPk(id);
};

export const updateExistingJobStatus = async (id: number, status: string) => {
  const job = await Job.findByPk(id);
  if (!job) throw new Error("Job not found");

 if (status === "Posted" && job.status !=="Posted") {
    return await job.update({
      status: status as any,
      postedAt: new Date()
    });
  }  
  return await job.update({ status: status as any });
};

export const deleteJob = async (id: number) => {
  const job = await Job.findByPk(id);
  if (!job) throw new Error("Job not found");
  return await job.destroy();
};

export const updateJobData = async (id: number, data: CreateJobInput) => {
  const job = await Job.findByPk(id);
  if (!job) throw new Error("Job not found");
  return await job.update(data as any);
};