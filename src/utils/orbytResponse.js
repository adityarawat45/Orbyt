const { publicBaseUrl } = require('../config/env');

function buildWebhookUrl(req, webhookToken) {
  const base = publicBaseUrl || `${req.protocol}://${req.get('host')}`;
  return `${base.replace(/\/$/, '')}/api/webhooks/github/${webhookToken}`;
}

function serializeOrbyt(orbyt, req) {
  const json = typeof orbyt.toJSON === 'function' ? orbyt.toJSON() : orbyt;
  return {
    ...json,
    webhookUrl: buildWebhookUrl(req, json.webhookToken),
  };
}

module.exports = {
  buildWebhookUrl,
  serializeOrbyt,
};
