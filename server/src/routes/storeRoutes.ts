import { Router } from 'express';
import { getStoreDetails, checkoutOrder, updateStoreRates } from '../controllers/storeController.js';

const router = Router();

router.get('/info', getStoreDetails);
router.post('/checkout', checkoutOrder);
router.put('/rates', updateStoreRates);

export default router;
