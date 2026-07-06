const test = require('node:test');
const assert = require('node:assert/strict');

const db = require('../models');

test('models expose user, orbyt, and orbyt event models with the expected associations', () => {
  assert.ok(db.User, 'Expected User model to be registered');
  assert.ok(db.Orbyt, 'Expected Orbyt model to be registered');
  assert.ok(db.OrbytEvent, 'Expected OrbytEvent model to be registered');
  assert.ok(db.Orbyt.rawAttributes.userId, 'Expected Orbyt to have a userId field');
  assert.ok(db.OrbytEvent.rawAttributes.orbytId, 'Expected OrbytEvent to have an orbytId field');
});
