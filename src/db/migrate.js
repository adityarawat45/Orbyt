const { execSync } = require('child_process');
const path = require('path');

function runMigrations() {
  try {
    const projectRoot = path.resolve(__dirname, '../..');
    execSync('npx sequelize-cli db:migrate', {
      cwd: projectRoot,
      stdio: 'inherit',
    });
  } catch (error) {
    console.error('Database migration failed.', error);
    process.exitCode = 1;
  }
}

runMigrations();
