import { Router } from 'express';
import { getStoreDetails, checkoutOrder, updateStoreRates } from '../controllers/storeController.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();

router.get('/info', getStoreDetails);
router.post('/checkout', checkoutOrder);
router.put('/rates', requireAdmin, updateStoreRates);

export default router;
