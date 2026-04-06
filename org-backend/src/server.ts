import app from "./app.js";
import SequelizeConfig from "./config/db.config.js";
import { redisclient } from "./config/redis.config.js";

const PORT = process.env.PORT;
   redisclient.on("connect", () => {
      console.log("REDIS Connected");
    });
    redisclient.on("error", (err: Error) => {
      console.error("REDIS error:", err);
    });

const startServer = async () => {
  try {
    await SequelizeConfig.sync();
    console.log('PostgreSQL Connected Successfully');
    app.listen(PORT, () => console.log('Server is Running on port ' + PORT));
  } catch (error) {
    console.error('Unable to Connect to DB:', error);
    process.exit(1);
  }
};

startServer();

