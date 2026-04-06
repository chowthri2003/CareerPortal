import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./modules/user/user.routes.js";
import jobRoutes from "./modules/job/job.routes.js";
import applicationRoutes from "./modules/application/application.routes.js";
import exportRoutes from "./modules/export/export.routes.js";
import { setupSwagger } from "./config/swagger.config.js";
import { logger } from "./utils/logger.js";
import { globalLimiter } from "./config/rateLimiter.config.js";
import { redisclient } from "./config/redis.config.js";
import SequelizeConfig from "./config/db.config.js";

dotenv.config();
const app = express();
const origin = process.env.CORS_ORIGIN;
app.use(cors({
 origin,
    credentials: true,
}));
app.use(express.json());
app.set("trust proxy", 1);
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.info("Request completed", {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
});

app.get("/api/health", async (req, res) => {
  let redisStatus = "down";
  let dbStatus = "down";

  try {
    await redisclient.ping();
    redisStatus = "up";
  } catch {}

  try {
    await SequelizeConfig.authenticate();
    dbStatus = "up";
  } catch {}

  const health = {
    status: "OK",
    redis: redisStatus,
    database: dbStatus,
    uptime: process.uptime(),
  };

  res.json(health);
});
setupSwagger(app);
app.use("/api", globalLimiter);
app.use("/uploads", express.static("uploads"));
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/data", exportRoutes);

export default app;
