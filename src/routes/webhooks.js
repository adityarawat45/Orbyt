const express = require('express');
const { handleGitHubWebhook } = require('../controllers/webhooksController');
const { createSubscription, listSubscriptions } = require('../controllers/subscriptionsController');

const router = express.Router();

router.post('/webhooks/github', handleGitHubWebhook);
router.get('/subscriptions', listSubscriptions);
router.post('/subscriptions', createSubscription);

module.exports = router;
