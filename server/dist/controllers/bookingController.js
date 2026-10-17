"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingStatus = exports.getAllBookings = exports.getBookingByRef = exports.createLuggageBooking = exports.calculateLuggageQuote = void 0;
const bookingService_js_1 = require("../services/bookingService.js");
const response_js_1 = require("../utils/response.js");
const calculateLuggageQuote = async (req, res) => {
    try {
        const { bagCount, durationHours, durationType } = req.body;
        const bags = parseInt(bagCount || '1', 10);
        const hours = parseFloat(durationHours || '3');
        const type = durationType || '3h';
        const quote = bookingService_js_1.bookingService.calculatePrice(bags, hours, type);
        return (0, response_js_1.sendSuccess)(res, quote, 'Quote calculated successfully');
    }
    catch (error) {
        return (0, response_js_1.sendError)(res, error.message || 'Failed to calculate quote', 400);
    }
};
exports.calculateLuggageQuote = calculateLuggageQuote;
const createLuggageBooking = async (req, res) => {
    try {
        const { customerName, customerEmail, customerPhone, whatsapp, bagCount, durationType, durationHours, dropoffTime, notes } = req.body;
        const result = await bookingService_js_1.bookingService.createBooking({
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
        return (0, response_js_1.sendSuccess)(res, result, 'Luggage booking created successfully', 201);
    }
    catch (error) {
        return (0, response_js_1.sendError)(res, error.message || 'Failed to create luggage booking', 400);
    }
};
exports.createLuggageBooking = createLuggageBooking;
const getBookingByRef = async (req, res) => {
    try {
        const { reference } = req.params;
        const booking = await bookingService_js_1.bookingService.getBookingByReference(reference);
        if (!booking) {
            return (0, response_js_1.sendError)(res, `Booking reference '${reference}' not found`, 404);
        }
        return (0, response_js_1.sendSuccess)(res, booking);
    }
    catch (error) {
        return (0, response_js_1.sendError)(res, error.message || 'Failed to fetch booking', 500);
    }
};
exports.getBookingByRef = getBookingByRef;
const getAllBookings = async (req, res) => {
    try {
        const bookings = await bookingService_js_1.bookingService.getAllBookings();
        return (0, response_js_1.sendSuccess)(res, bookings, 'Luggage bookings fetched successfully');
    }
    catch (error) {
        return (0, response_js_1.sendError)(res, error.message || 'Failed to fetch bookings', 500);
    }
};
exports.getAllBookings = getAllBookings;
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updated = await bookingService_js_1.bookingService.updateBookingStatus(id, status);
        if (!updated) {
            return (0, response_js_1.sendError)(res, `Booking '${id}' not found`, 404);
        }
        return (0, response_js_1.sendSuccess)(res, updated, 'Booking status updated successfully');
    }
    catch (error) {
        return (0, response_js_1.sendError)(res, error.message || 'Failed to update booking status', 500);
    }
};
exports.updateBookingStatus = updateBookingStatus;
