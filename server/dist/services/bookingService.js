"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingService = exports.BookingService = void 0;
const mockDatabase_js_1 = require("../data/mockDatabase.js");
const index_js_1 = require("../config/index.js");
const whatsapp_js_1 = require("../utils/whatsapp.js");
class BookingService {
    /**
     * Calculates pricing based on bag count and duration.
     * Rates:
     * - 1 hour: €2.50 / bag
     * - 3 hours: €5.00 / bag
     * - 1 day (up to 24 hours): €8.00 / bag
     * - Custom: base €8.00 for first 24h + €1.50 per extra hour or standard tiered calculation.
     */
    calculatePrice(bagCount, durationHours, durationType) {
        const rates = index_js_1.config.store.luggageRates;
        let pricePerBag = 0;
        let breakdown = '';
        if (durationType === '1h' || durationHours <= 1) {
            pricePerBag = rates.oneHour;
            breakdown = `€${rates.oneHour.toFixed(2)} × ${bagCount} mala(s) (1 Hora)`;
        }
        else if (durationType === '3h' || (durationHours > 1 && durationHours <= 3)) {
            pricePerBag = rates.threeHours;
            breakdown = `€${rates.threeHours.toFixed(2)} × ${bagCount} mala(s) (3 Horas)`;
        }
        else if (durationType === '1d' || (durationHours > 3 && durationHours <= 24)) {
            pricePerBag = rates.oneDay;
            breakdown = `€${rates.oneDay.toFixed(2)} × ${bagCount} mala(s) (Diária / 1 Dia)`;
        }
        else {
            // Custom / Multi-day
            const days = Math.floor(durationHours / 24);
            const remainingHours = durationHours % 24;
            const daysCost = days * rates.oneDay;
            const extraCost = Math.min(remainingHours * rates.extraHour, rates.oneDay);
            pricePerBag = daysCost + extraCost;
            breakdown = `€${pricePerBag.toFixed(2)} por mala (${durationHours} horas personalizadas)`;
        }
        const totalPrice = Number((pricePerBag * bagCount).toFixed(2));
        return {
            bagCount,
            durationHours,
            durationType,
            pricePerBag: Number(pricePerBag.toFixed(2)),
            totalPrice,
            breakdown
        };
    }
    async createBooking(data) {
        const quote = this.calculatePrice(data.bagCount, data.durationHours, data.durationType);
        const dropoffDate = new Date(data.dropoffTime);
        const pickupDate = new Date(dropoffDate.getTime() + data.durationHours * 3600 * 1000);
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const reference = `MC-LUG-${randomSuffix}`;
        const newBooking = {
            ...data,
            id: `book-${Date.now()}`,
            bookingReference: reference,
            pickupTime: pickupDate.toISOString(),
            totalPrice: quote.totalPrice,
            status: 'CONFIRMED',
            createdAt: new Date().toISOString()
        };
        mockDatabase_js_1.mockBookings.push(newBooking);
        const whatsappUrl = (0, whatsapp_js_1.formatLuggageWhatsAppMessage)(newBooking);
        return {
            booking: newBooking,
            whatsappUrl
        };
    }
    async getBookingByReference(reference) {
        const found = mockDatabase_js_1.mockBookings.find(b => b.bookingReference === reference);
        return found || null;
    }
}
exports.BookingService = BookingService;
exports.bookingService = new BookingService();
