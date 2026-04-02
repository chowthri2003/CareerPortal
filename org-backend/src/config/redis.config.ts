import Redis from "ioredis";

export const redisclient = new ( Redis as any)({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});
