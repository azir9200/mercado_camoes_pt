import { Router } from 'express';
import categoryRoutes from './categoryRoutes.js';
import productRoutes from './productRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import storeRoutes from './storeRoutes.js';

const apiRouter = Router();

apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/storage', bookingRoutes);
apiRouter.use('/store', storeRoutes);

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Mercado Camões API',
    version: '1.0.0'
  });
});

export default apiRouter;
