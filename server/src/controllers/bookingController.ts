import { Request, Response } from 'express';
import { bookingService } from '../services/bookingService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const calculateLuggageQuote = async (req: Request, res: Response) => {
  try {
    const { bagCount, durationHours, durationType } = req.body;
    const bags = parseInt(bagCount || '1', 10);
    const hours = parseFloat(durationHours || '3');
    const type = durationType || '3h';

    const quote = bookingService.calculatePrice(bags, hours, type);
    return sendSuccess(res, quote, 'Quote calculated successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to calculate quote', 400);
  }
};

export const createLuggageBooking = async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      whatsapp,
      bagCount,
      durationType,
      durationHours,
      dropoffTime,
      notes
    } = req.body;

    const result = await bookingService.createBooking({
      customerName,
      customerEmail,
      customerPhone,
      whatsapp: whatsapp || customerPhone,
      bagCount: parseInt(bagCount, 10),
      durationType: durationType || '3h',
      durationHours: parseFloat(durationHours),
      dropoffTime: dropoffTime || new Date().toISOString(),
      notes
    });

    return sendSuccess(res, result, 'Luggage booking created successfully', 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create luggage booking', 400);
  }
};

export const getBookingByRef = async (req: Request, res: Response) => {
  try {
    const { reference } = req.params;
    const booking = await bookingService.getBookingByReference(reference);
    if (!booking) {
      return sendError(res, `Booking reference '${reference}' not found`, 404);
    }
    return sendSuccess(res, booking);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch booking', 500);
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await bookingService.getAllBookings();
    return sendSuccess(res, bookings, 'Luggage bookings fetched successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch bookings', 500);
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await bookingService.updateBookingStatus(id, status);
    if (!updated) {
      return sendError(res, `Booking '${id}' not found`, 404);
    }
    return sendSuccess(res, updated, 'Booking status updated successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update booking status', 500);
  }
};
