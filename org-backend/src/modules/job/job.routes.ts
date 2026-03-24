import { Router } from "express";
import { getJobs, createJob, getSingleJob, changeJobStatus,updateJob, removeJob } from "./job.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { azureAuth } from "../../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job management APIs
 *
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: Frontend Developer
 *         location:
 *           type: string
 *           example: Chennai
 *         experienceRequired:
 *           type: string
 *           example: 3+ Years
 *         workMode:
 *           type: string
 *           enum: [On-site, Hybrid, Remote]
 *         jobType:
 *           type: string
 *           enum: [Full-time, Contract, Internship]
 *         roleOverview:
 *           type: string
 *           example: Build scalable frontend applications
 *         keyRequirements:
 *           type: string
 *           example: React, TypeScript, Tailwind
 *         coreRequirements:
 *           type: string
 *           example: Problem solving and clean coding
 *         status:
 *           type: string
 *           enum: [Posted, Draft, Position Filled]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all jobs
 *     description: Returns a list of jobs. If adminView=true, draft and Position Filled jobs will also be returned.
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: adminView
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Set true to view all jobs including drafts and Position Filled
 *     responses:
 *       200:
 *         description: List of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *       500:
 *         description: Server error
 */
router.get("/", getJobs);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Get a single job
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getSingleJob);

// ADMIN ROUTES 
/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create a new job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - location
 *               - experienceRequired
 *               - workMode
 *               - jobType
 *               - roleOverview
 *               - keyRequirements
 *               - coreRequirements
 *             properties:
 *               title:
 *                 type: string
 *                 example: Backend Developer
 *               location:
 *                 type: string
 *                 example: Bangalore
 *               experienceRequired:
 *                 type: string
 *                 example: 2+ Years
 *               workMode:
 *                 type: string
 *                 enum: [On-site, Hybrid, Remote]
 *               jobType:
 *                 type: string
 *                 enum: [Full-time, Contract, Internship]
 *               roleOverview:
 *                 type: string
 *                 example: Develop scalable backend APIs
 *               keyRequirements:
 *                 type: string
 *                 example: Node.js, PostgreSQL
 *               coreRequirements:
 *                 type: string
 *                 example: Clean architecture and microservices
 *     responses:
 *       201:
 *         description: Job created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/",azureAuth, protect, createJob);

/**
 * @swagger
 * /jobs/{id}/status:
 *   patch:
 *     summary: Update job status
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Posted, Draft, Position Filled]
 *                 example: Posted
 *     responses:
 *       200:
 *         description: Job status updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job not found
 *       500:
 *         description: Server error
 */
router.patch("/:id/status",azureAuth, protect, changeJobStatus);

/**
 * @swagger
 * /jobs/{id}:
 *   put:
 *     summary: Update an existing job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       200:
 *         description: Job updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job not found
 *       500:
 *         description: Server error
 */
router.put("/:id",azureAuth, protect, updateJob);    

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     summary: Delete a job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job not found
 *       500:
 *         description: Server error
 */
router.delete("/:id",azureAuth, protect, removeJob);

export default router;