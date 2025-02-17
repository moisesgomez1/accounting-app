// lib/sequelize.ts
import { Sequelize } from 'sequelize';

// Ensure you have DATABASE_URL defined in your .env file, e.g.:
// DATABASE_URL=postgres://username:password@localhost:5432/mydatabase
const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false, // set to console.log to enable query logging
});

export default sequelize;
