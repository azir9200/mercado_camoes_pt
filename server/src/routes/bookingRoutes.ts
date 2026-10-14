import { Router } from 'express';
import { calculateLuggageQuote, createLuggageBooking, getBookingByRef } from '../controllers/bookingController.js';

const router = Router();

router.post('/quote', calculateLuggageQuote);
router.post('/book', createLuggageBooking);
router.get('/:reference', getBookingByRef);

export default router;
