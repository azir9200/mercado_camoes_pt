import { dbStore } from '../data/dbStore.js';
import { OrderDTO, OrderCheckoutRequest, OrderStatus } from '../types/index.js';
import { formatOrderWhatsAppMessage } from '../utils/whatsapp.js';

export class OrderService {
  async getOrders(): Promise<OrderDTO[]> {
    return [...dbStore.getOrders()].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getOrderById(idOrNumber: string): Promise<OrderDTO | null> {
    const found = dbStore.getOrderById(idOrNumber);
    return found || null;
  }

  async createOrder(data: OrderCheckoutRequest): Promise<{ order: OrderDTO; whatsappUrl: string }> {
    const total = data.items.reduce((sum, item: any) => sum + (item.quantity || 1) * (item.unitPrice ?? item.price ?? 0), 0);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `MC-ORD-${randomSuffix}`;

    const newOrder: OrderDTO = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: data.customerName || 'Cliente Visitante',
      customerPhone: data.customerPhone || '',
      deliveryOption: data.deliveryOption || 'pickup',
      notes: data.notes,
      items: data.items,
      totalPrice: Number(total.toFixed(2)),
      status: 'PENDING',
      orderType: data.orderType || 'DIRECT',
      createdAt: new Date().toISOString()
    };

    dbStore.createOrder(newOrder);

    const whatsappUrl = formatOrderWhatsAppMessage(data);

    return {
      order: newOrder,
      whatsappUrl
    };
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<OrderDTO | null> {
    return dbStore.updateOrderStatus(id, status);
  }
}

export const orderService = new OrderService();
