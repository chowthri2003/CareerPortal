import app from "./app.js";
import SequelizeConfig from "./config/db.config.js";


const PORT = process.env.PORT || 4000;


const startServer = async (): Promise<void> => {
  try {
    await SequelizeConfig.authenticate();
    console.log('PostgreSQL connected successfully');
    await SequelizeConfig.sync({ alter: true });
    app.listen(PORT, () => console.log('Server is Running on port ' + PORT));
    console.log('Remainder connected successfully');
  } catch (error) {
    console.error('Unable to connect to DB:', error);
    process.exit(1);
  }
};

startServer();

