import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();

let SequelizeConfig: Sequelize;

if (process.env.DATABASE_URL) {
  SequelizeConfig = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, 
      },
    },
  });
} else {
 
  SequelizeConfig = new Sequelize(
    process.env.DB_NAME || "",
    process.env.DB_USER || "",
    process.env.DB_PASSWORD || "",
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      dialect: "postgres",
      logging: false,
      timezone: "+00:00",
      pool: {
        max: 20,
        min: 0,
        acquire: 60000,
        idle: 10000,
      },
      define: {
        underscored: true,
        timestamps: false,
      },
    }
  );
}

export default SequelizeConfig;

