import { Category, Product, StoreInfo, LuggageBookingFormData, LuggageBookingConfirmation, CartItem } from '../types';
import { initialCategories, initialProducts, initialStoreInfo } from './mockData';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE}/categories`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('API request failed');
    const json = await res.json();
    return json.data || initialCategories;
  } catch {
    return initialCategories;
  }
}

export async function fetchProducts(params?: { category?: string; featured?: boolean; search?: string }): Promise<Product[]> {
  try {
    const url = new URL(`${API_BASE}/products`);
    if (params?.category) url.searchParams.set('category', params.category);
    if (params?.featured !== undefined) url.searchParams.set('featured', String(params.featured));
    if (params?.search) url.searchParams.set('search', params.search);

    const res = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('API request failed');
    const json = await res.json();
    return json.data || initialProducts;
  } catch {
    let list = [...initialProducts];
    if (params?.category) {
      list = list.filter(p => p.categoryId === params.category || p.category?.slug === params.category);
    }
    if (params?.featured !== undefined) {
      list = list.filter(p => p.isFeatured === params.featured);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(p => p.name_en.toLowerCase().includes(q) || p.name_pt.toLowerCase().includes(q));
    }
    return list;
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('API request failed');
    const json = await res.json();
    return json.data || null;
  } catch {
    const found = initialProducts.find(p => p.id === id || p.sku === id);
    return found || null;
  }
}

export async function fetchStoreInfo(): Promise<StoreInfo> {
  try {
    const res = await fetch(`${API_BASE}/store/info`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error('API request failed');
    const json = await res.json();
    return json.data || initialStoreInfo;
  } catch {
    return initialStoreInfo;
  }
}

export async function createLuggageBooking(booking: LuggageBookingFormData): Promise<{ booking: LuggageBookingConfirmation; whatsappUrl: string }> {
  try {
    const res = await fetch(`${API_BASE}/storage/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch {
    // fallback if server is offline
  }

  // Fallback direct WhatsApp generator
  const ref = `MC-LUG-${Math.floor(1000 + Math.random() * 9000)}`;
  const rates = initialStoreInfo.luggageRates;
  let pricePerBag = rates.threeHours;
  if (booking.durationType === '1h') pricePerBag = rates.oneHour;
  else if (booking.durationType === '1d') pricePerBag = rates.oneDay;
  else if (booking.durationType === 'custom') pricePerBag = rates.oneDay;

  const total = pricePerBag * booking.bagCount;
  const dropoff = new Date(booking.dropoffTime).toLocaleString('pt-PT');

  const text = `🧳 *RESERVA DE BAGAGEM / LUGGAGE STORAGE*
*Mercado Camões - Lisboa*
----------------------------------------
🔖 *Ref:* ${ref}
👤 *Nome / Name:* ${booking.customerName}
📱 *WhatsApp/Tel:* ${booking.customerPhone}
💼 *Malas / Bags:* ${booking.bagCount}
⏱️ *Duração / Duration:* ${booking.durationType} (${booking.durationHours}h)
📥 *Entrega / Drop-off:* ${dropoff}
💰 *Total Previsto:* €${total.toFixed(2)}
${booking.notes ? `📝 *Notas:* ${booking.notes}\n` : ''}
📍 *Morada:* Praça Luís de Camões 22, Lisboa`;

  const whatsappUrl = `https://wa.me/351912345678?text=${encodeURIComponent(text)}`;

  return {
    booking: {
      id: `local-${Date.now()}`,
      bookingReference: ref,
      customerName: booking.customerName,
      bagCount: booking.bagCount,
      durationType: booking.durationType,
      durationHours: booking.durationHours,
      dropoffTime: booking.dropoffTime,
      pickupTime: new Date(Date.now() + booking.durationHours * 3600000).toISOString(),
      totalPrice: total,
      status: 'CONFIRMED',
      notes: booking.notes
    },
    whatsappUrl
  };
}

export function generateCartWhatsAppUrl(items: CartItem[], customerName: string, customerPhone: string, deliveryOption: 'pickup' | 'local_delivery', notes?: string): string {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const itemList = items
    .map((item, idx) => `${idx + 1}. ${item.product.name_en} / ${item.product.name_pt} x${item.quantity} - €${(item.product.price * item.quantity).toFixed(2)}`)
    .join('\n');

  const text = `🛍️ *NOVA ENCOMENDA / NEW ORDER - Mercado Camões*
----------------------------------------
👤 *Cliente / Customer:* ${customerName || 'Cliente'}
📞 *Contacto / Phone:* ${customerPhone || 'N/A'}
🚚 *Modalidade / Option:* ${deliveryOption === 'pickup' ? 'Levantamento na Loja (Store Pickup)' : 'Entrega no Alojamento (Delivery)'}
${notes ? `📝 *Notas / Notes:* ${notes}\n` : ''}
🛒 *Artigos / Items:*
${itemList}

💰 *TOTAL:* €${total.toFixed(2)}
----------------------------------------
📍 Praça Luís de Camões 22, Lisboa
Por favor confirmem a disponibilidade do pedido. / Please confirm order.`;

  return `https://wa.me/351912345678?text=${encodeURIComponent(text)}`;
}
