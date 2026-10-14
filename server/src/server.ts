import app from './app.js';
import { config } from './config/index.js';

const startServer = () => {
  try {
    app.listen(config.port, () => {
      console.log(`===============================================`);
      console.log(` 🛍️  Mercado Camões API Server running!        `);
      console.log(` 🌍  Port: ${config.port}                      `);
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
