import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./modules/user/user.routes.js";
import jobRoutes from "./modules/job/job.routes.js";
import applicationRoutes from "./modules/application/application.routes.js";
import exportRoutes from "./modules/export/export.routes.js";
import { setupSwagger } from "./config/swagger.config.js";
import { morganMiddleware } from "./utils/morgan.js";
import { logger } from "./utils/logger.js";


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
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
app.use(morganMiddleware);

setupSwagger(app);

app.use("/uploads", express.static("uploads"));
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api", exportRoutes);

export default app;
