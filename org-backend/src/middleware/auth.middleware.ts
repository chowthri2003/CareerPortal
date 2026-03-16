import { expressjwt } from "express-jwt";
import jwksRsa from "jwks-rsa";
import { Request, Response, NextFunction } from "express";
import User from "../modules/user/user.model.js";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
      auth?: any;
    }
  }
}

export const azureAuth = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksUri: `https://login.microsoftonline.com/289b0710-fda8-4386-aa2b-49936e406df7/discovery/v2.0/keys`,
  }) as any,

  audience: "fa475c60-51f3-4d58-bcaf-7aefa2169dcc",
  issuer: `https://login.microsoftonline.com/289b0710-fda8-4386-aa2b-49936e406df7/v2.0`,
  algorithms: ["RS256"],
});

export const protect = async ( req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenUser = req.auth;
    if (!tokenUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Token missing",
      });
    }

    const email =
      tokenUser.preferred_username ||
      tokenUser.email;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email not found in token",
      });
    }

    const dbUser = await User.findOne({
      where: { email },
    });

    if (!dbUser) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this organization.",
      });
    }

    if (!dbUser.providerId) {
      dbUser.providerId = tokenUser.oid;
      await dbUser.save();
    }

    if (!dbUser.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Contact admin.",
      });
    }

    req.userId = tokenUser.oid;
    req.userEmail = email;

    next();
  } catch (error) {
    console.error("Protect middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const authorize = (roles: ("admin" | "hr")[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const user = await User.findOne({
        where: { providerId: req.userId },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden - You do not have permission",
        });
      }

      next();
    } catch (error) {
      console.error("Authorization error:", error);

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
};