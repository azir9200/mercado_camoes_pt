import { Router } from 'express';
import { calculateLuggageQuote, createLuggageBooking, getBookingByRef, getAllBookings, updateBookingStatus } from '../controllers/bookingController.js';

const router = Router();

router.get('/bookings', getAllBookings);
router.patch('/bookings/:id/status', updateBookingStatus);
router.post('/quote', calculateLuggageQuote);
router.post('/book', createLuggageBooking);
router.get('/:reference', getBookingByRef);

export default router;
