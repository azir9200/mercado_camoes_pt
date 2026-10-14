import { Router } from 'express';
import { getStoreDetails, checkoutOrder } from '../controllers/storeController.js';

const router = Router();

router.get('/info', getStoreDetails);
router.post('/checkout', checkoutOrder);

export default router;
