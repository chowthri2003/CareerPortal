import { Router } from "express";
import { getUsers, changeUserRole, createUser, getMe } from "./user.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { azureAuth, authorize } from "../../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication APIs
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         providerId:
 *           type: string
 *           example: "local"
 *         email:
 *           type: string
 *           example: mavens@company.com
 *         role:
 *           type: string
 *           enum: [admin, hr]
 *           example: admin
 *         isActive:
 *           type: boolean
 *           example: true
 *
 *     CreateUserInput:
 *       type: object
 *       required:
 *         - email
 *         - providerId
 *       properties:
 *         email:
 *           type: string
 *           example: hr@company.com
 *         providerId:
 *           type: string
 *           example: azure-123456
 *         role:
 *           type: string
 *           enum: [admin, hr]
 *           example: hr
 *
 *     UpdateUserRoleInput:
 *       type: object
 *       properties:
 *         role:
 *           type: string
 *           enum: [admin, hr]
 *           example: hr
 *         isActive:
 *           type: boolean
 *           example: true
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current authenticated user
 *     description: Returns the details of the currently logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/me", azureAuth, protect, getMe);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Returns a list of all users. Accessible by admin and HR.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get("/", azureAuth, protect, authorize(["admin", "hr"]), getUsers);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update user role or status
 *     description: Allows admin to update a user's role or activation status
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRoleInput'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.patch("/:id", azureAuth, protect, authorize(["admin"]), changeUserRole);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Admin can create a new HR or Admin user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: User already exists or validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.post("/", azureAuth, protect, authorize(["admin"]), createUser);
export default router;
