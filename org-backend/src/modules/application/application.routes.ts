import { Router } from "express";
import { submitApplication, getApplications, updateStatus, downloadResume, previewResume } from "./application.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import upload from "../../middleware/upload.middleware.js";
import { azureAuth } from "../../middleware/auth.middleware.js";
import { parseResume } from "./application.controller.js";

const router = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     ExperienceItem:
 *       type: object
 *       properties:
 *         companyName:
 *           type: string
 *         jobTitle:
 *           type: string
 *         currentlyWorking:
 *           type: boolean
 *         dateOfJoining:
 *           type: string
 *           format: date
 *         dateOfRelieving:
 *           type: string
 *           format: date
 *         description:
 *           type: string
 *
 *     EducationItem:
 *       type: object
 *       properties:
 *         course:
 *           type: string
 *         branch:
 *           type: string
 *         startOfCourse:
 *           type: string
 *         endOfCourse:
 *           type: string
 *         university:
 *           type: string
 *
 *     Application:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         jobId:
 *           type: integer
 *         firstName:
 *           type: string
 *         middleName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         mobilePhone:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *         totalExperience:
 *           type: string
 *         currentSalary:
 *           type: string
 *         noticePeriod:
 *           type: integer
 *         skills:
 *           type: string
 *         gender:
 *           type: string
 *         resumeUrl:
 *           type: string
 *         storageProvider:
 *           type: string
 *         status:
 *           type: string
 *           enum: [New, Screened, Interviewing, Offered, Rejected]
 *         experienceDetails:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ExperienceItem'
 *         educationDetails:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EducationItem'
 */
/**
 * @swagger
 * /applications/parse-resume:
 *   post:
 *     summary: Parse resume using AI
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Resume parsed successfully
 *       400:
 *         description: Resume file required
 */
router.post("/parse-resume", upload.single("resume"), parseResume);
/**
 * @swagger
 * /applications/apply:
 *   post:
 *     summary: Submit a job application
 *     description: Candidate applies for a job by submitting personal, professional, experience, education details and uploading a resume.
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *               - firstName
 *               - lastName
 *               - email
 *               - mobilePhone
 *               - dateOfBirth
 *               - gender
 *               - totalExperience
 *               - noticePeriod
 *               - currentSalary
 *               - skills
 *               - resume
 *             properties:
 *               jobId:
 *                 type: integer
 *                 example: 1
 *               firstName:
 *                 type: string
 *                 example: John
 *               middleName:
 *                 type: string
 *                 example: K
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               mobilePhone:
 *                 type: string
 *                 example: "9876543210"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "1998-05-21"
 *               gender:
 *                 type: string
 *                 example: Male
 *               totalExperience:
 *                 type: string
 *                 example: "3 Years"
 *               noticePeriod:
 *                 type: integer
 *                 example: 30
 *               currentSalary:
 *                 type: string
 *                 example: "6 LPA"
 *               skills:
 *                 type: string
 *                 example: "React, Node.js, PostgreSQL"
 *               experienceDetails:
 *                 type: string
 *                 description: JSON string containing experience details
 *                 example: '[{"companyName":"ABC Pvt Ltd","jobTitle":"Frontend Developer","currentlyWorking":false,"dateOfJoining":"2022-01-10","dateOfRelieving":"2024-01-10","description":"Worked on React applications"}]'
 *               educationDetails:
 *                 type: string
 *                 description: JSON string containing education details
 *                 example: '[{"course":"B.Tech","branch":"CSE","university":"Anna University","startOfCourse":"2017-06-01","endOfCourse":"2021-05-01"}]'
 *               resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.get("/", azureAuth, protect, getApplications);
/**
 * @swagger
 * /applications/{id}/resume/download:
 *   get:
 *     summary: Download applicant resume
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Resume file
 */
router.get("/:id/resume/download", azureAuth, protect, downloadResume);
/**
 * @swagger
 * /applications/{id}/status:
 *   patch:
 *     summary: Update application status
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [New, Screened, Interviewing, Offered, Rejected]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch("/:id/status", azureAuth, protect, updateStatus);
/**
 * @swagger
 * /applications/{id}/resume/preview:
 *   get:
 *     summary: Preview applicant resume
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Resume preview stream
 */
router.get("/:id/resume/preview", azureAuth, protect, previewResume);

export default router;