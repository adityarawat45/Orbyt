const axios = require('axios');
const { discordWebhookUrl } = require('../config/env');

async function sendDiscordNotification(message, options = {}) {
  const targetWebhookUrl = options.webhookUrl || discordWebhookUrl;

  if (!targetWebhookUrl) {
    throw new Error('Discord webhook URL is not configured.');
  }

  await axios.post(
    targetWebhookUrl,
    {
      content: message,
      username: options.username || 'Orbyt',
      avatar_url: options.avatarUrl || null,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    },
  );
}

module.exports = {
  sendDiscordNotification,
};
