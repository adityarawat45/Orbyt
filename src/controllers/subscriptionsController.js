const crypto = require('crypto');
const { Orbyt, OrbytEvent } = require('../../models');
const { serializeOrbyt } = require('../utils/orbytResponse');

function getOwnedOrbytWhere(req, id) {
  return {
    id,
    userId: req.auth?.userId || null,
  };
}

async function createSubscription(req, res) {
  try {
    const { name, repository, sourceWebhookSecret, destinationWebhookUrl } = req.body || {};

    if (!name || !repository || !sourceWebhookSecret || !destinationWebhookUrl) {
      return res.status(400).json({
        ok: false,
        error: 'name, repository, sourceWebhookSecret and destinationWebhookUrl are required.',
      });
    }

    const subscription = await Orbyt.create({
      name,
      repository,
      sourceWebhookSecret,
      destinationWebhookUrl,
      webhookToken: crypto.randomUUID(),
      destinationUsername: 'Orbyt',
      active: true,
      userId: req.auth?.userId || null,
    });

    res.status(201).json({ ok: true, data: serializeOrbyt(subscription, req) });
  } catch (error) {
    console.error('Failed to create subscription.', error);
    res.status(500).json({ ok: false, error: 'Failed to create subscription.' });
  }
}

async function listSubscriptions(req, res) {
  try {
    const subscriptions = await Orbyt.findAll({
      where: req.auth?.userId ? { userId: req.auth.userId } : undefined,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      ok: true,
      data: subscriptions.map((subscription) => serializeOrbyt(subscription, req)),
    });
  } catch (error) {
    console.error('Failed to list subscriptions.', error);
    res.status(500).json({ ok: false, error: 'Failed to list subscriptions.' });
  }
}

async function updateSubscription(req, res) {
  try {
    const { id } = req.params;
    const { name, repository, sourceWebhookSecret, destinationWebhookUrl, active } = req.body || {};
    const subscription = await Orbyt.findOne({ where: getOwnedOrbytWhere(req, id) });

    if (!subscription) {
      return res.status(404).json({ ok: false, error: 'Orbyt not found.' });
    }

    await subscription.update({
      name: name || subscription.name,
      repository: repository || subscription.repository,
      sourceWebhookSecret: sourceWebhookSecret || subscription.sourceWebhookSecret,
      destinationWebhookUrl: destinationWebhookUrl || subscription.destinationWebhookUrl,
      active: typeof active === 'boolean' ? active : subscription.active,
    });

    return res.status(200).json({ ok: true, data: serializeOrbyt(subscription, req) });
  } catch (error) {
    console.error('Failed to update subscription.', error);
    return res.status(500).json({ ok: false, error: 'Failed to update Orbyt.' });
  }
}

async function deleteSubscription(req, res) {
  try {
    const { id } = req.params;
    const subscription = await Orbyt.findOne({ where: getOwnedOrbytWhere(req, id) });

    if (!subscription) {
      return res.status(404).json({ ok: false, error: 'Orbyt not found.' });
    }

    await OrbytEvent.destroy({ where: { orbytId: subscription.id } });
    await subscription.destroy();

    return res.status(200).json({ ok: true, message: 'Orbyt deleted.' });
  } catch (error) {
    console.error('Failed to delete subscription.', error);
    return res.status(500).json({ ok: false, error: 'Failed to delete Orbyt.' });
  }
}

async function getSubscriptionLogs(req, res) {
  try {
    const { id } = req.params;
    const subscription = await Orbyt.findOne({ where: getOwnedOrbytWhere(req, id) });

    if (!subscription) {
      return res.status(404).json({ ok: false, error: 'Orbyt not found.' });
    }

    const events = await OrbytEvent.findAll({
      where: { orbytId: subscription.id },
      order: [['sentAt', 'DESC']],
      limit: 25,
    });

    return res.status(200).json({ ok: true, data: events });
  } catch (error) {
    console.error('Failed to fetch Orbyt logs.', error);
    return res.status(500).json({ ok: false, error: 'Failed to fetch Orbyt logs.' });
  }
}

module.exports = {
  createSubscription,
  listSubscriptions,
  updateSubscription,
  deleteSubscription,
  getSubscriptionLogs,
};
