import winston from "winston";

const isProduction = process.env.NODE_ENV === "production";

export const logger = winston.createLogger({
    level: isProduction? "info": "debug",
    format: winston.format.combine(
        winston.format.timestamp(),
        isProduction? winston.format.json(): winston.format.simple()
    ),
    transports: [
         new winston.transports.File({filename: "logs/all.log",}),
         new winston.transports.File({filename: "logs/error.log",level: "error",}),
    ],
});