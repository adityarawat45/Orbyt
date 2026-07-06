const test = require('node:test');
const assert = require('node:assert/strict');

const { buildFallbackIssueMessage } = require('../src/utils/issueMessage');

test('buildFallbackIssueMessage includes repository and issue details', () => {
  const message = buildFallbackIssueMessage({
    action: 'opened',
    repository: 'acme/widgets',
    title: 'Crash on startup',
    number: 42,
    actor: 'octocat',
    url: 'https://github.com/acme/widgets/issues/42',
  });

  assert.match(message, /Crash on startup/);
  assert.match(message, /acme\/widgets/);
  assert.match(message, /#42/);
  assert.match(message, /octocat/);
});
