import { mockBookings } from '../data/mockDatabase.js';
import { config } from '../config/index.js';
import { LuggageBookingDTO, LuggageBookingRequest } from '../types/index.js';
import { formatLuggageWhatsAppMessage } from '../utils/whatsapp.js';

export interface StorageQuote {
  bagCount: number;
  durationHours: number;
  durationType: string;
  pricePerBag: number;
  totalPrice: number;
  breakdown: string;
}

export class BookingService {
  /**
   * Calculates pricing based on bag count and duration.
   * Rates:
   * - 1 hour: €2.50 / bag
   * - 3 hours: €5.00 / bag
   * - 1 day (up to 24 hours): €8.00 / bag
   * - Custom: base €8.00 for first 24h + €1.50 per extra hour or standard tiered calculation.
   */
  calculatePrice(bagCount: number, durationHours: number, durationType: string): StorageQuote {
    const rates = config.store.luggageRates;
    let pricePerBag = 0;
    let breakdown = '';

    if (durationType === '1h' || durationHours <= 1) {
      pricePerBag = rates.oneHour;
      breakdown = `€${rates.oneHour.toFixed(2)} × ${bagCount} mala(s) (1 Hora)`;
    } else if (durationType === '3h' || (durationHours > 1 && durationHours <= 3)) {
      pricePerBag = rates.threeHours;
      breakdown = `€${rates.threeHours.toFixed(2)} × ${bagCount} mala(s) (3 Horas)`;
    } else if (durationType === '1d' || (durationHours > 3 && durationHours <= 24)) {
      pricePerBag = rates.oneDay;
      breakdown = `€${rates.oneDay.toFixed(2)} × ${bagCount} mala(s) (Diária / 1 Dia)`;
    } else {
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

  async createBooking(data: LuggageBookingRequest): Promise<{ booking: LuggageBookingDTO; whatsappUrl: string }> {
    const quote = this.calculatePrice(data.bagCount, data.durationHours, data.durationType);
    const dropoffDate = new Date(data.dropoffTime);
    const pickupDate = new Date(dropoffDate.getTime() + data.durationHours * 3600 * 1000);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const reference = `MC-LUG-${randomSuffix}`;

    const newBooking: LuggageBookingDTO = {
      ...data,
      id: `book-${Date.now()}`,
      bookingReference: reference,
      pickupTime: pickupDate.toISOString(),
      totalPrice: quote.totalPrice,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    };

    mockBookings.push(newBooking);

    const whatsappUrl = formatLuggageWhatsAppMessage(newBooking);

    return {
      booking: newBooking,
      whatsappUrl
    };
  }

  async getBookingByReference(reference: string): Promise<LuggageBookingDTO | null> {
    const found = mockBookings.find(b => b.bookingReference === reference);
    return found || null;
  }
}

export const bookingService = new BookingService();
