const test = require('node:test');
const assert = require('node:assert/strict');

const db = require('../models');

test('models expose user and subscription models with a user reference', () => {
  assert.ok(db.User, 'Expected User model to be registered');
  assert.ok(db.WebhookSubscription, 'Expected WebhookSubscription model to be registered');
  assert.ok(db.WebhookSubscription.rawAttributes.userId, 'Expected WebhookSubscription to have a userId field');
});
