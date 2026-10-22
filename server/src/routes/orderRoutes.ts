import { Router } from 'express';
import { getOrders, createOrder, updateOrderStatus } from '../controllers/orderController.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();

router.get('/', requireAdmin, getOrders);
router.post('/', createOrder);
router.patch('/:id/status', requireAdmin, updateOrderStatus);

export default router;
