// lib/sequelize.ts
import { Sequelize } from "sequelize";
import config from "../config/config";
import pg from 'pg';

// If you don't have NODE_ENV set, we'll use the production config by default.
const dbConfig = config["development"];

const sequelize = new Sequelize(
  dbConfig.database!,
  dbConfig.username!,
  dbConfig.password!,
  {
    logging: false,        // Disable query logging; change to console.log to debug
    timezone: "+00:00",    // Set the desired timezone
    host: dbConfig.host,
    dialect: dbConfig.dialect as any,
    dialectModule: pg,
    pool: {
      max: 5,             // Maximum number of connections in the pool
      min: 0,             // Minimum number of connections in the pool
      acquire: 30000,     // Maximum time (ms) pool will try to get a connection before throwing an error
      idle: 10000,        // Maximum time (ms) a connection can be idle before being released
    },
  }
);


// First, test the database connection using the pool
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection established successfully.");

    // Then sync your models; this uses the pool as well
    return sequelize.sync({ force: false });
  })
  .then(() => {
    console.log("Database synced successfully.");
  })
  .catch((error) => {
    console.error("Database error:", error);
  });

export default sequelize;
