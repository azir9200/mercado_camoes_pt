import { Router } from 'express';
import { calculateLuggageQuote, createLuggageBooking, getBookingByRef, getAllBookings, updateBookingStatus } from '../controllers/bookingController.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();

router.get('/bookings', requireAdmin, getAllBookings);
router.patch('/bookings/:id/status', requireAdmin, updateBookingStatus);
router.post('/quote', calculateLuggageQuote);
router.post('/book', createLuggageBooking);
router.get('/:reference', getBookingByRef);

export default router;
