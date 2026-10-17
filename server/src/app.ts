import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import apiRoutes from './routes/apiRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger in dev
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// API Routes
app.use('/api/v1', apiRoutes);

// Root Welcome Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Mercado Camões API',
    documentation: '/api/v1/health',
    endpoints: {
      categories: '/api/v1/categories',
      products: '/api/v1/products',
      featured: '/api/v1/products/featured',
      luggageStorage: '/api/v1/storage',
      store: '/api/v1/store/info'
    }
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
