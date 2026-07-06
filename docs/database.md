# Database design

The initial schema uses a single Sequelize model for webhook subscriptions.

## WebhookSubscription

| Column | Type | Purpose |
| --- | --- | --- |
| id | INTEGER | Primary key |
| name | STRING | Display name for the integration |
| repository | STRING | Full GitHub repository name, for example `owner/repo` |
| githubWebhookSecret | STRING | Secret used to verify incoming GitHub webhook signatures |
| discordWebhookUrl | STRING | Destination Discord webhook URL |
| discordUsername | STRING | Optional bot username for Discord messages |
| discordAvatarUrl | STRING | Optional bot avatar URL for Discord messages |
| active | BOOLEAN | Enables or disables the subscription |
| createdAt | DATE | Creation timestamp |
| updatedAt | DATE | Last update timestamp |

This makes it easy to add more providers later, such as Slack or Teams, by introducing additional models or expanding the subscription payload.
