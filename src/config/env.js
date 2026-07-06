require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT || 3000),
  nodeEnv: process.env.NODE_ENV || 'development',
  geminiApiKey: process.env.GEMINI_KEY || process.env.GEMINI_API_KEY || '',
  geminiApiUrl: process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
  githubWebhookSecret: process.env.GITHUB_WEBHOOK_SECRET || '',
  discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL || '',
  database: {
    dialect: process.env.DB_DIALECT || 'mysql',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    username: process.env.DB_USER || process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'orbyt',
    storage: process.env.DB_STORAGE || 'orbyt.sqlite',
  },
};
