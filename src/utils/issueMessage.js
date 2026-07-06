function buildFallbackIssueMessage(event) {
  const action = (event?.action || 'updated').toString();
  const repository = event?.repository || 'unknown/repository';
  const title = event?.title || 'Issue updated';
  const number = event?.number ? `#${event.number}` : '';
  const actor = event?.actor || 'a contributor';
  const url = event?.url || '';
  const summary = event?.body ? ` Summary: ${event.body.slice(0, 120)}${event.body.length > 120 ? '…' : ''}` : '';

  return `📝 Issue ${action} in ${repository}${number ? ` ${number}` : ''}: "${title}" by ${actor}.${summary}${url ? `\n${url}` : ''}`;
}

function buildIssueNotification(event) {
  return buildFallbackIssueMessage(event);
}

module.exports = {
  buildFallbackIssueMessage,
  buildIssueNotification,
};
