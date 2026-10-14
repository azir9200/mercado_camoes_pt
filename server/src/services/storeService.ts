import { config } from '../config/index.js';
import { OrderCheckoutRequest } from '../types/index.js';
import { formatOrderWhatsAppMessage } from '../utils/whatsapp.js';

export class StoreService {
  getStoreInfo() {
    return {
      name: config.store.name,
      address: config.store.address,
      phone: config.store.phone,
      whatsapp: config.store.whatsapp,
      email: config.store.email,
      openingHours: config.store.openingHours,
      geo: config.store.geo,
      luggageRates: config.store.luggageRates
    };
  }

  processOrderCheckout(order: OrderCheckoutRequest): { success: boolean; whatsappUrl: string; total: number } {
    const total = order.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const whatsappUrl = formatOrderWhatsAppMessage(order);

    return {
      success: true,
      whatsappUrl,
      total: Number(total.toFixed(2))
    };
  }
}

export const storeService = new StoreService();
