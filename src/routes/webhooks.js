const express = require('express');
const { handleGitHubWebhook } = require('../controllers/webhooksController');
const {
  createSubscription,
  listSubscriptions,
  updateSubscription,
  deleteSubscription,
  getSubscriptionLogs,
} = require('../controllers/subscriptionsController');
const { requireClerkAuth } = require('../middleware/clerkAuth');

const router = express.Router();

router.post('/webhooks/github/:webhookToken', handleGitHubWebhook);
router.get('/auth/me', requireClerkAuth, (req, res) => {
  res.status(200).json({
    ok: true,
    data: {
      userId: req.auth.userId,
      clerkUserId: req.auth.clerkUserId,
    },
  });
});
router.get('/subscriptions', requireClerkAuth, listSubscriptions);
router.post('/subscriptions', requireClerkAuth, createSubscription);
router.patch('/subscriptions/:id', requireClerkAuth, updateSubscription);
router.delete('/subscriptions/:id', requireClerkAuth, deleteSubscription);
router.get('/subscriptions/:id/logs', requireClerkAuth, getSubscriptionLogs);

module.exports = router;
