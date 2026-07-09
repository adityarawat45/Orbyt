const test = require('node:test');
const assert = require('node:assert/strict');

test('requireClerkAuth reports misconfiguration when Clerk secret is missing', async () => {
  process.env.CLERK_SECRET_KEY = '';
  delete require.cache[require.resolve('../src/config/env')];
  delete require.cache[require.resolve('../src/middleware/clerkAuth')];

  const { requireClerkAuth } = require('../src/middleware/clerkAuth');

  let statusCode = 0;
  let payload = null;

  const req = { headers: {} };
  const res = {
    status(code) {
      statusCode = code;
      return {
        json(data) {
          payload = data;
        },
      };
    },
  };

  await requireClerkAuth(req, res, () => {
    throw new Error('next should not be called when Clerk is misconfigured');
  });

  assert.equal(statusCode, 503);
  assert.equal(payload.ok, false);
  assert.match(payload.error, /Clerk/i);
});
