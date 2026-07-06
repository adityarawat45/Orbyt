const sequelize = require('../config/database');
const WebhookSubscription = require('./WebhookSubscription');

module.exports = {
  sequelize,
  WebhookSubscription,
};
