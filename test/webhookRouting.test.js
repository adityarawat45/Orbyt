const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');

const { verifySignature, getRepositoryName } = require('../src/controllers/webhooksController');
const { buildWebhookUrl } = require('../src/utils/orbytResponse');

test('getRepositoryName returns full_name when available', () => {
  const name = getRepositoryName({ repository: { full_name: 'acme/app', name: 'app' } });
  assert.equal(name, 'acme/app');
});

test('verifySignature accepts a valid GitHub sha256 signature', () => {
  const secret = 'test-secret';
  const payload = '{"action":"opened"}';
  const signature = `sha256=${crypto.createHmac('sha256', secret).update(payload).digest('hex')}`;

  assert.equal(verifySignature(payload, signature, secret), true);
});

test('verifySignature rejects an invalid signature', () => {
  assert.equal(verifySignature('{}', 'sha256=deadbeef', 'test-secret'), false);
});

test('buildWebhookUrl uses PUBLIC_BASE_URL when configured', () => {
  const original = process.env.PUBLIC_BASE_URL;
  process.env.PUBLIC_BASE_URL = 'https://orbyt.example.com';

  delete require.cache[require.resolve('../src/config/env')];
  delete require.cache[require.resolve('../src/utils/orbytResponse')];
  const { buildWebhookUrl: buildUrl } = require('../src/utils/orbytResponse');

  const req = { protocol: 'http', get: () => 'localhost:3000' };
  const url = buildUrl(req, 'token-123');

  assert.equal(url, 'https://orbyt.example.com/api/webhooks/github/token-123');

  process.env.PUBLIC_BASE_URL = original;
  delete require.cache[require.resolve('../src/config/env')];
  delete require.cache[require.resolve('../src/utils/orbytResponse')];
});
