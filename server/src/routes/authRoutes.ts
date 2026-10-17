import { Router } from 'express';
import { adminLogin, verifySession } from '../controllers/authController.js';

const router = Router();

router.post('/login', adminLogin);
router.get('/verify', verifySession);

export default router;
