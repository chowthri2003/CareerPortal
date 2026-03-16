import { Request, Response } from "express";
import XLSX from "xlsx";
import Application from "../application/application.model.js";
import Job from "../job/job.model.js";

export const exportApplicationsReport = async (req: Request, res: Response) => {
  try {
   const applications = await Application.findAll({
  include: [
    {
      model: Job,
      as: "job",
      attributes: ["title"]
    }
  ],
  raw: true,
  nest: true
});

   const formattedData = applications.map((app: any) => ({
  Name: `${app.firstName} ${app.lastName}`,
  Email: app.email,
  JobTitle: app.job?.title || "",
  Status: app.status,
  AppliedDate: app.createdAt
}));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx"
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=applications-report.xlsx"
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};