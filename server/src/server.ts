import app from './app.js';
import { config } from './config/index.js';

const startServer = () => {
  try {
    app.listen(config.port, config.host, () => {
      console.log(`===============================================`);
      console.log(` 🛍️  Mercado De Camões API Server running!        `);
      console.log(` 🌍  Address: ${config.host}:${config.port}       `);
      console.log(` 🌐  Client URL: ${config.clientUrl}           `);
      console.log(` 🔗  Endpoints: http://localhost:${config.port}/api/v1/health `);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
