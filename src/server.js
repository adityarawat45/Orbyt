const { app, initializeApp } = require('./app');
const { port } = require('./config/env');

initializeApp()
  .then(() => {
    app.listen(port, () => {
      console.log(`Orbyt listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize Orbyt.', error);
    process.exit(1);
  });
