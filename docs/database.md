# Database design

The schema uses Sequelize models for users, Orbyt integrations, and delivery events.

## User

| Column | Type | Purpose |
| --- | --- | --- |
| id | INTEGER | Primary key |
| clerkUserId | STRING | Clerk user identifier |
| email | STRING | User email from Clerk |
| fullName | STRING | Display name from Clerk |
| createdAt | DATE | Creation timestamp |
| updatedAt | DATE | Last update timestamp |

## Orbyt

| Column | Type | Purpose |
| --- | --- | --- |
| id | INTEGER | Primary key |
| name | STRING | Display name for the integration |
| repository | STRING | Full GitHub repository name, for example `owner/repo` |
| webhookToken | STRING | Unique token used in the GitHub payload URL |
| sourceProvider | STRING | Source provider, default `github` |
| sourceWebhookSecret | STRING | Secret used to verify incoming GitHub webhook signatures |
| destinationProvider | STRING | Destination provider, default `discord` |
| destinationWebhookUrl | STRING | Destination Discord webhook URL |
| destinationUsername | STRING | Optional bot username for Discord messages |
| destinationAvatarUrl | STRING | Optional bot avatar URL for Discord messages |
| eventTypes | JSON | Supported event types, default `["issues"]` |
| userId | INTEGER | Owning user |
| active | BOOLEAN | Enables or disables the Orbyt |
| createdAt | DATE | Creation timestamp |
| updatedAt | DATE | Last update timestamp |

Each Orbyt receives a unique GitHub webhook URL:

`/api/webhooks/github/:webhookToken`

Set `PUBLIC_BASE_URL` on the backend when exposing the API through ngrok or another public host so the dashboard shows the correct payload URL.

## OrbytEvent

| Column | Type | Purpose |
| --- | --- | --- |
| id | INTEGER | Primary key |
| orbytId | INTEGER | Parent Orbyt |
| message | TEXT | Message sent to Discord |
| eventType | STRING | GitHub event type |
| sentAt | DATE | Delivery timestamp |
| createdAt | DATE | Creation timestamp |
| updatedAt | DATE | Last update timestamp |
