import { Router } from "express";
import { exportApplicationsReport } from "./export.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { azureAuth } from "../../middleware/auth.middleware.js";
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Export
 *   description: Data export APIs
 */

/**
 * @swagger
 * /export/applications:
 *   get:
 *     summary: Export applications report
 *     description: Download an Excel report containing all job applications including applicant name, email, job title, status, and applied date.
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Excel file containing applications report
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Internal server error
 */
router.get("/export/applications",azureAuth, protect,exportApplicationsReport);
export default router;