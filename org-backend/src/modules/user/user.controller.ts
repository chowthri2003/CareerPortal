import { Request, Response } from "express";
import { updateUserRole, getAllUsers } from "./user.service.js";
import { updateUserRoleSchema } from "./user.schema.js";
import User from "./user.model.js";
import { logger } from "../../utils/logger.js";

export const getUsers = async (_req: Request, res: Response) => {
 try{
  const users = await getAllUsers();
  res.json({
    success: true,
    data: users
  });
 } catch (error: any) {
    logger.error("Failed to fetch users", {
      message: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const changeUserRole = async (req: Request, res: Response) => {
  const parsed = updateUserRoleSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.format()
    });
  }

  try {
    const updated = await updateUserRole(req.params.id as string, parsed.data);

    res.json({ success: true, data: updated });
  } catch (error: any) {
    if (error.message === "User not found") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { email, role, providerId } = req.body;

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      providerId,
      email,
      role: role || "hr",
      isActive: true,
    });

    res.status(201).json({
       success: true,
        data: user
       });
  } catch (error: any) {
    logger.error("Failed to create users", {
      message: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({
      where: { email: req.userEmail },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    logger.error("Failed to fetch user", {
      message: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};