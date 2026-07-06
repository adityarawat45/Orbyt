const sequelize = require('../config/database');

async function runMigrations() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
    console.log('Database schema synchronized.');
  } catch (error) {
    console.error('Database migration failed.', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

runMigrations();
