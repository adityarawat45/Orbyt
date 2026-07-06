const { WebhookSubscription } = require('../models');

async function createSubscription(req, res) {
  try {
    const { name, repository, githubWebhookSecret, discordWebhookUrl, discordUsername, discordAvatarUrl, active } = req.body || {};

    if (!name || !repository || !githubWebhookSecret || !discordWebhookUrl) {
      return res.status(400).json({ ok: false, error: 'name, repository, githubWebhookSecret and discordWebhookUrl are required.' });
    }

    const subscription = await WebhookSubscription.create({
      name,
      repository,
      githubWebhookSecret,
      discordWebhookUrl,
      discordUsername: discordUsername || 'Orbyt',
      discordAvatarUrl,
      active: active !== false,
    });

    res.status(201).json({ ok: true, data: subscription });
  } catch (error) {
    console.error('Failed to create subscription.', error);
    res.status(500).json({ ok: false, error: 'Failed to create subscription.' });
  }
}

async function listSubscriptions(req, res) {
  try {
    const subscriptions = await WebhookSubscription.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json({ ok: true, data: subscriptions });
  } catch (error) {
    console.error('Failed to list subscriptions.', error);
    res.status(500).json({ ok: false, error: 'Failed to list subscriptions.' });
  }
}

module.exports = {
  createSubscription,
  listSubscriptions,
};
