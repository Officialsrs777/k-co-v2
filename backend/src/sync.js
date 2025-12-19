import sequelize from './config/db.js';
import { Client, User } from './models/index.js';
import { URL } from 'url';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully!');

    // Show parsed DATABASE_URL info
    const dbUrl = new URL(process.env.DATABASE_URL);
    console.log('Dialect:', sequelize.getDialect());
    console.log('Host:', dbUrl.hostname);
    console.log('Port:', dbUrl.port);
    console.log('Database:', dbUrl.pathname.slice(1));
    console.log('User:', dbUrl.username);

    // Sync all models and create tables if they don’t exist
    await sequelize.sync({ force: true }); // force: true creates fresh tables
    console.log('✅ All tables synced and created in public schema!');
  } catch (err) {
    console.error('❌ Error connecting or syncing database:', err);
  } finally {
    await sequelize.close();
  }
})();
