const { Sequelize } = require('sequelize');
const { database } = require('./env');

const sequelize = new Sequelize({
  dialect: database.dialect,
  host: database.host,
  port: database.port,
  username: database.username,
  password: database.password,
  database: database.database,
  storage: database.storage,
  logging: false,
});

module.exports = sequelize;
