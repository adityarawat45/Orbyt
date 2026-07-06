const express = require('express');
const { sequelize } = require('./models');
const webhooksRoutes = require('./routes/webhooks');

const app = express();

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  },
}));

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true, service: 'Orbyt' });
});

app.use('/api', webhooksRoutes);

async function initializeApp() {
  await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
  return app;
}

module.exports = {
  app,
  initializeApp,
};
