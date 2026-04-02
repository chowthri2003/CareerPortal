import app from "./app.js";
import SequelizeConfig from "./config/db.config.js";


const PORT = process.env.PORT;


const startServer = async () => {
  try {
    await SequelizeConfig.sync();
    console.log('PostgreSQL connected successfully');
    app.listen(PORT, () => console.log('Server is Running on port ' + PORT));
    console.log('Remainder connected successfully');
  } catch (error) {
    console.error('Unable to connect to DB:', error);
    process.exit(1);
  }
};

startServer();

