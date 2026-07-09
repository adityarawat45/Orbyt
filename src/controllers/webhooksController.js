const crypto = require('crypto');
const { Orbyt, OrbytEvent } = require('../../models');
const { generateNotificationMessage } = require('../services/aiService');
const { sendDiscordNotification } = require('../services/discordService');
const { githubWebhookSecret } = require('../config/env');

function getRepositoryName(payload) {
  return payload?.repository?.full_name || payload?.repository?.name || 'unknown/unknown';
}

function verifySignature(payload, signature, secret) {
  if (!secret) {
    return true;
  }

  if (!signature) {
    return false;
  }

  const expected = `sha256=${crypto.createHmac('sha256', secret).update(payload).digest('hex')}`;
  if (signature.length !== expected.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

async function handleGitHubWebhook(req, res) {
  try {
    const { webhookToken } = req.params;
    const rawBody = req.rawBody ? req.rawBody.toString('utf8') : JSON.stringify(req.body || {});
    const eventName = req.get('x-github-event') || '';

    if (!webhookToken) {
      return res.status(400).json({ ok: false, error: 'Webhook token is required.' });
    }

    if (eventName !== 'issues') {
      return res.status(202).json({ ok: true, ignored: true, reason: 'Only issue events are processed.' });
    }

    const subscription = await Orbyt.findOne({
      where: { webhookToken, active: true },
    });

    if (!subscription) {
      return res.status(404).json({ ok: false, error: 'Orbyt not found or inactive.' });
    }

    const payload = req.body || {};
    const repository = getRepositoryName(payload);

    if (subscription.repository !== repository) {
      return res.status(400).json({
        ok: false,
        error: `Repository mismatch. This Orbyt is configured for ${subscription.repository}.`,
      });
    }

    const secretToUse = subscription.sourceWebhookSecret || githubWebhookSecret;
    const signature = req.get('x-hub-signature-256') || req.get('x-hub-signature') || '';

    if (!verifySignature(rawBody, signature, secretToUse)) {
      return res.status(401).json({ ok: false, error: 'Invalid GitHub signature.' });
    }

    if (!payload.issue) {
      return res.status(400).json({ ok: false, error: 'Issue payload is required.' });
    }

    const eventData = {
      action: payload.action,
      title: payload.issue?.title,
      number: payload.issue?.number,
      repository,
      actor: payload.sender?.login || payload.issue?.user?.login || 'unknown',
      url: payload.issue?.html_url || payload.issue?.url || '',
      body: payload.issue?.body || '',
    };

    const message = await generateNotificationMessage(eventData);

    await sendDiscordNotification(message, {
      username: subscription.destinationUsername || 'Orbyt',
      avatarUrl: subscription.destinationAvatarUrl || null,
      webhookUrl: subscription.destinationWebhookUrl,
    });

    await OrbytEvent.create({
      orbytId: subscription.id,
      message,
      eventType: eventName,
      sentAt: new Date(),
    });

    return res.status(200).json({ ok: true, message: 'Webhook processed successfully.' });
  } catch (error) {
    console.error('Failed to process GitHub webhook.', error);
    return res.status(502).json({ ok: false, error: 'Failed to process GitHub webhook.' });
  }
}

module.exports = {
  handleGitHubWebhook,
  getRepositoryName,
  verifySignature,
};
