import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redisclient } from "./redis.config.js";
import { logger } from "../utils/logger.js";

export const globalLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: any[]) => redisclient.call(...args),
    prefix: "career-portal:global:", 
  }),
  windowMs: 15 * 60 * 1000,
  max: 100,

  skip: (req) => req.originalUrl.includes("/api/applications/parse-resume"),
  handler: (req, res) => {
    logger.warn("Global rate limit exceeded", {
      ip: req.ip,
      url: req.originalUrl,
    });

    res.status(429).json({
      success: false,
      message: "Too many requests, please try again later",
    });
  },
});


export const resumeLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: any[]) => redisclient.call(...args),
    prefix: "career-portal:resume:", 
  }),
  windowMs: 15 * 60 * 1000,
  max: 5,

    skipSuccessfulRequests: false,
    skipFailedRequests: true,
    validate: { singleCount: false },
    
  handler: (req, res) => {
    logger.error("Resume parser rate limit exceeded", {
      ip: req.ip,
    });

    res.status(429).json({
      success: false,
      message: "Resume parsing limit exceeded. Try later.",
    });
  },
});