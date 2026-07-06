const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WebhookSubscription = sequelize.createSchema('WebhookSubscription', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  repository: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  githubWebhookSecret: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discordWebhookUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discordUsername: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Orbyt',
  },
  discordAvatarUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

module.exports = WebhookSubscription;
