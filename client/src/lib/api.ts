import {
  Category,
  Product,
  StoreInfo,
  LuggageBookingFormData,
  LuggageBookingConfirmation,
  CartItem,
  Order,
  OrderStatus
} from '../types';
import { initialCategories, initialProducts, initialStoreInfo } from './mockData';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
export const TARGET_WHATSAPP_PHONE = '+351920319177';
export const STORE_ADDRESS_PORTO = 'Rua Camões 242, 4000-140 Porto, Portugal';

// Helper to sanitize phone for WhatsApp
export function sanitizeWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, '');
  return digits.length > 0 ? digits : '351920319177';
}

/* =========================================================================
   LOCAL STORAGE PERSISTENCE ENGINE
   ========================================================================= */

const STORAGE_KEYS = {
  PRODUCTS: 'mc_live_products',
  CATEGORIES: 'mc_live_categories',
  STORE_INFO: 'mc_live_store_info',
  ORDERS: 'mc_live_orders',
  BOOKINGS: 'mc_live_bookings'
};

// Automatic filter to purge old mock/dummy orders and bookings from user localStorage
function purgeLegacyDummyData(): void {
  if (typeof window === 'undefined') return;
  try {
    const dummyNames = ['tiago santos', 'emma watson', 'sarah jenkins', 'miguel albuquerque', 'test customer'];

    const rawOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (rawOrders) {
      const orders = JSON.parse(rawOrders);
      if (Array.isArray(orders)) {
        const cleanOrders = orders.filter((o: any) => !dummyNames.includes((o.customerName || '').toLowerCase().trim()));
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(cleanOrders));
      }
    }

    const rawBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (rawBookings) {
      const bookings = JSON.parse(rawBookings);
      if (Array.isArray(bookings)) {
        const cleanBookings = bookings.filter((b: any) => !dummyNames.includes((b.customerName || '').toLowerCase().trim()));
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(cleanBookings));
      }
    }
  } catch {
    // ignore
  }
}

// Run purge once on client initialization
if (typeof window !== 'undefined') {
  purgeLegacyDummyData();
}

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to write to localStorage for key: ${key}`, err);
  }
}

/* =========================================================================
   PRODUCTS & CATEGORIES API (Backend + Synchronized LocalStorage)
   ========================================================================= */

export async function fetchCategories(): Promise<Category[]> {
  // 1. Try to fetch fresh from Backend
  try {
    const res = await fetch(`${API_BASE}/categories`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        writeStorage(STORAGE_KEYS.CATEGORIES, json.data);
        return json.data;
      }
    }
  } catch {
    // Backend offline / unreachable, fallback to localStorage
  }

  // 2. Return cached from localStorage or default seed
  const stored = readStorage<Category[]>(STORAGE_KEYS.CATEGORIES, []);
  if (stored && stored.length > 0) {
    return stored;
  }

  // 3. Fallback to initial seed & initialize storage
  writeStorage(STORAGE_KEYS.CATEGORIES, initialCategories);
  return initialCategories;
}

export async function fetchProducts(params?: {
  category?: string;
  featured?: boolean;
  search?: string;
}): Promise<Product[]> {
  let allProducts: Product[] = [];

  // 1. Try to fetch fresh from Backend
  try {
    const url = new URL(`${API_BASE}/products`);
    if (params?.category) url.searchParams.set('category', params.category);
    if (params?.featured !== undefined) url.searchParams.set('featured', String(params.featured));
    if (params?.search) url.searchParams.set('search', params.search);

    const res = await fetch(url.toString(), {
      cache: 'no-store'
    });

    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data)) {
        // If it was an unfiltered query, update full cache
        if (!params?.category && params?.featured === undefined && !params?.search) {
          writeStorage(STORAGE_KEYS.PRODUCTS, json.data);
        }
        return json.data;
      }
    }
  } catch {
    // Backend offline / unreachable
  }

  // 2. Fallback to localStorage
  allProducts = readStorage<Product[]>(STORAGE_KEYS.PRODUCTS, []);
  if (allProducts.length === 0) {
    allProducts = [...initialProducts];
    writeStorage(STORAGE_KEYS.PRODUCTS, allProducts);
  }

  // 3. Apply local filters if needed
  let filtered = [...allProducts];
  if (params?.category) {
    filtered = filtered.filter(
      p => p.categoryId === params.category || p.category?.slug === params.category
    );
  }
  if (params?.featured !== undefined) {
    filtered = filtered.filter(p => Boolean(p.isFeatured) === Boolean(params.featured));
  }
  if (params?.search && params.search.trim().length > 0) {
    const q = params.search.toLowerCase().trim();
    filtered = filtered.filter(
      p =>
        p.name_en.toLowerCase().includes(q) ||
        p.name_pt.toLowerCase().includes(q) ||
        p.description_en?.toLowerCase().includes(q) ||
        p.description_pt?.toLowerCase().includes(q)
    );
  }

  return filtered;
}

export async function fetchProductById(id: string): Promise<Product | null> {
  // 1. Try backend
  try {
    const res = await fetch(`${API_BASE}/products/${id}`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.data) return json.data;
    }
  } catch {
    // fallback
  }

  // 2. Find in localStorage
  const list = readStorage<Product[]>(STORAGE_KEYS.PRODUCTS, initialProducts);
  return list.find(p => p.id === id || p.sku === id) || null;
}

export async function uploadProductImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_BASE}/uploads/product-image`, {
    method: 'POST',
    body: formData
  });
  const json = await res.json();
  if (!res.ok || !json.data?.url) {
    throw new Error(json.error || 'Image upload failed. Please try again.');
  }

  const apiOrigin = API_BASE.startsWith('http') ? new URL(API_BASE).origin : window.location.origin;
  return new URL(json.data.url, apiOrigin).toString();
}

export async function createProduct(productData: Partial<Product>): Promise<Product> {
  const newProd: Product = {
    id: `prod-${Date.now()}`,
    sku: productData.sku || `MC-${Math.floor(1000 + Math.random() * 9000)}`,
    name_en: productData.name_en || 'Product',
    name_pt: productData.name_pt || 'Produto',
    description_en: productData.description_en || '',
    description_pt: productData.description_pt || '',
    price: Number(productData.price) || 0,
    stock: Number(productData.stock) || 50,
    unit: productData.unit || 'item',
    isFeatured: !!productData.isFeatured,
    categoryId: productData.categoryId || 'cat-food-grocery',
    images: productData.images || [
      {
        id: `img-${Date.now()}`,
        url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
        isPrimary: true
      }
    ]
  };

  // 1. Send to Backend
  try {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        newProd.id = json.data.id;
        newProd.sku = json.data.sku;
      }
    }
  } catch {
    // Backend offline, will use local id
  }

  // 2. Always persist in localStorage
  const current = readStorage<Product[]>(STORAGE_KEYS.PRODUCTS, initialProducts);
  const updated = [newProd, ...current.filter(p => p.id !== newProd.id)];
  writeStorage(STORAGE_KEYS.PRODUCTS, updated);

  return newProd;
}

export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product | null> {
  let resultProd: Product | null = null;

  // 1. Send to Backend
  try {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    if (res.ok) {
      const json = await res.json();
      resultProd = json.data;
    }
  } catch {
    // Backend offline
  }

  // 2. Persist in localStorage
  const current = readStorage<Product[]>(STORAGE_KEYS.PRODUCTS, initialProducts);
  const idx = current.findIndex(p => p.id === id || p.sku === id);
  if (idx !== -1) {
    const merged = { ...current[idx], ...productData };
    current[idx] = merged;
    writeStorage(STORAGE_KEYS.PRODUCTS, current);
    return resultProd || merged;
  }

  return resultProd;
}

export async function deleteProduct(id: string): Promise<boolean> {
  // 1. Send to Backend
  try {
    await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
  } catch {
    // ignore
  }

  // 2. Remove from localStorage
  const current = readStorage<Product[]>(STORAGE_KEYS.PRODUCTS, initialProducts);
  const filtered = current.filter(p => p.id !== id && p.sku !== id);
  writeStorage(STORAGE_KEYS.PRODUCTS, filtered);

  return true;
}

export async function createCategory(catData: Partial<Category>): Promise<Category> {
  const newCat: Category = {
    id: `cat-${catData.slug || Date.now()}`,
    slug: catData.slug || `category-${Date.now()}`,
    name_en: catData.name_en || 'Category',
    name_pt: catData.name_pt || 'Categoria',
    description_en: catData.description_en,
    description_pt: catData.description_pt,
    icon: catData.icon || 'ShoppingBag',
    displayOrder: 99
  };

  // 1. Send to Backend
  try {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(catData)
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        newCat.id = json.data.id;
        newCat.slug = json.data.slug;
      }
    }
  } catch {
    // Backend offline
  }

  // 2. Save in localStorage
  const current = readStorage<Category[]>(STORAGE_KEYS.CATEGORIES, initialCategories);
  const updated = [...current, newCat];
  writeStorage(STORAGE_KEYS.CATEGORIES, updated);

  return newCat;
}

export async function updateCategory(id: string, catData: Partial<Category>): Promise<Category | null> {
  // 1. Send to Backend
  try {
    await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(catData)
    });
  } catch {
    // Backend offline
  }

  // 2. Update in localStorage
  const current = readStorage<Category[]>(STORAGE_KEYS.CATEGORIES, initialCategories);
  const idx = current.findIndex(c => c.id === id || c.slug === id);
  if (idx !== -1) {
    current[idx] = { ...current[idx], ...catData };
    writeStorage(STORAGE_KEYS.CATEGORIES, current);
    return current[idx];
  }

  return null;
}

export async function deleteCategory(id: string): Promise<boolean> {
  // 1. Send to Backend
  try {
    await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
  } catch {
    // Backend offline
  }

  // 2. Remove from localStorage
  const current = readStorage<Category[]>(STORAGE_KEYS.CATEGORIES, initialCategories);
  const filtered = current.filter(c => c.id !== id && c.slug !== id);
  writeStorage(STORAGE_KEYS.CATEGORIES, filtered);

  return true;
}

/* =========================================================================
   STORE & LUGGAGE RATES
   ========================================================================= */

export async function fetchStoreInfo(): Promise<StoreInfo> {
  // 1. Try Backend
  try {
    const res = await fetch(`${API_BASE}/store/info`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        writeStorage(STORAGE_KEYS.STORE_INFO, json.data);
        return json.data;
      }
    }
  } catch {
    // Backend offline
  }

  // 2. Read from localStorage
  const stored = readStorage<StoreInfo>(STORAGE_KEYS.STORE_INFO, initialStoreInfo);
  return stored;
}

export async function updateLuggageRates(rates: {
  oneHour?: number;
  threeHours?: number;
  oneDay?: number;
  extraHour?: number;
}): Promise<any> {
  // 1. Send to Backend
  try {
    const res = await fetch(`${API_BASE}/store/rates`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rates)
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        const info = readStorage<StoreInfo>(STORAGE_KEYS.STORE_INFO, initialStoreInfo);
        info.luggageRates = json.data;
        writeStorage(STORAGE_KEYS.STORE_INFO, info);
        return json.data;
      }
    }
  } catch {
    // Backend offline
  }

  // 2. Update localStorage
  const info = readStorage<StoreInfo>(STORAGE_KEYS.STORE_INFO, initialStoreInfo);
  if (rates.oneHour !== undefined) info.luggageRates.oneHour = Number(rates.oneHour);
  if (rates.threeHours !== undefined) info.luggageRates.threeHours = Number(rates.threeHours);
  if (rates.oneDay !== undefined) info.luggageRates.oneDay = Number(rates.oneDay);
  if (rates.extraHour !== undefined) info.luggageRates.extraHour = Number(rates.extraHour);
  writeStorage(STORAGE_KEYS.STORE_INFO, info);

  return info.luggageRates;
}

/* =========================================================================
   ORDERS & LUGGAGE BOOKINGS (WhatsApp + Direct)
   ========================================================================= */

export async function submitDirectOrder(orderData: {
  customerName: string;
  customerPhone: string;
  deliveryOption: 'pickup' | 'local_delivery';
  notes?: string;
  items: { productId: string; name: string; quantity: number; unitPrice: number }[];
  orderType?: 'WHATSAPP' | 'DIRECT';
}): Promise<{ order: Order; success: boolean }> {
  const total = orderData.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const fallbackOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber: `MC-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    customerName: orderData.customerName,
    customerPhone: orderData.customerPhone,
    deliveryOption: orderData.deliveryOption,
    notes: orderData.notes,
    items: orderData.items,
    totalPrice: Number(total.toFixed(2)),
    status: 'PENDING',
    orderType: orderData.orderType || 'DIRECT',
    createdAt: new Date().toISOString()
  };

  let finalOrder = fallbackOrder;

  // 1. Send to Backend
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data?.order) {
        finalOrder = json.data.order;
      }
    }
  } catch {
    // Backend offline
  }

  // 2. Always persist in localStorage
  const existing = readStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
  const updated = [finalOrder, ...existing.filter(o => o.id !== finalOrder.id)];
  writeStorage(STORAGE_KEYS.ORDERS, updated);

  return { order: finalOrder, success: true };
}

export async function fetchOrders(): Promise<Order[]> {
  let backendOrders: Order[] = [];

  // 1. Try Backend
  try {
    const res = await fetch(`${API_BASE}/orders`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data)) {
        backendOrders = json.data;
      }
    }
  } catch {
    // Backend offline
  }

  // 2. Merge with localStorage
  const localOrders = readStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
  const mergedMap = new Map<string, Order>();

  // Add backend orders first
  backendOrders.forEach(o => mergedMap.set(o.id || o.orderNumber, o));
  // Merge local orders so offline orders are never lost
  localOrders.forEach(o => mergedMap.set(o.id || o.orderNumber, o));

  const mergedList = Array.from(mergedMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  writeStorage(STORAGE_KEYS.ORDERS, mergedList);
  return mergedList;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  // 1. Send to Backend
  try {
    await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  } catch {
    // Backend offline
  }

  // 2. Update in localStorage
  const current = readStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
  const idx = current.findIndex(o => o.id === orderId || o.orderNumber === orderId);
  if (idx !== -1) {
    current[idx].status = status;
    writeStorage(STORAGE_KEYS.ORDERS, current);
    return true;
  }

  return false;
}

export async function createLuggageBooking(
  booking: LuggageBookingFormData
): Promise<{ booking: LuggageBookingConfirmation; whatsappUrl: string }> {
  const storeInfo = readStorage<StoreInfo>(STORAGE_KEYS.STORE_INFO, initialStoreInfo);
  const rates = storeInfo.luggageRates;

  let pricePerBag = rates.threeHours;
  if (booking.durationType === '1h') pricePerBag = rates.oneHour;
  else if (booking.durationType === '1d') pricePerBag = rates.oneDay;
  else if (booking.durationType === 'custom') {
    const days = Math.floor(booking.durationHours / 24);
    const rem = booking.durationHours % 24;
    pricePerBag = days * rates.oneDay + Math.min(rem * rates.extraHour, rates.oneDay);
  }

  const total = Number((pricePerBag * booking.bagCount).toFixed(2));
  const ref = `MC-LUG-${Math.floor(1000 + Math.random() * 9000)}`;

  const fallbackBooking: LuggageBookingConfirmation = {
    id: `book-${Date.now()}`,
    bookingReference: ref,
    customerName: booking.customerName,
    bagCount: booking.bagCount,
    durationType: booking.durationType,
    durationHours: booking.durationHours,
    dropoffTime: booking.dropoffTime,
    pickupTime: new Date(new Date(booking.dropoffTime).getTime() + booking.durationHours * 3600000).toISOString(),
    totalPrice: total,
    status: 'CONFIRMED',
    notes: booking.notes
  };

  const dropoff = new Date(booking.dropoffTime).toLocaleString('pt-PT');
  const text = `🧳 *RESERVA DE BAGAGEM / LUGGAGE STORAGE*
*Mercado De Camões - Porto*
----------------------------------------
🔖 *Ref:* ${ref}
👤 *Nome / Name:* ${booking.customerName}
📱 *WhatsApp/Tel:* ${booking.customerPhone}
💼 *Malas / Bags:* ${booking.bagCount}
⏱️ *Duração / Duration:* ${booking.durationType} (${booking.durationHours}h)
📥 *Entrega / Drop-off:* ${dropoff}
💰 *Total Previsto:* €${total.toFixed(2)}
${booking.notes ? `📝 *Notas:* ${booking.notes}\n` : ''}
📍 *Morada / Address:* Rua Camões 242, 4000-140 Porto
Por favor confirmem a minha reserva. / Please confirm my booking.`;

  const fallbackWhatsappUrl = `https://wa.me/351920319177?text=${encodeURIComponent(text)}`;

  let finalBooking = fallbackBooking;
  let finalWhatsappUrl = fallbackWhatsappUrl;

  // 1. Send to Backend
  try {
    const res = await fetch(`${API_BASE}/storage/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data?.booking) {
        finalBooking = json.data.booking;
        finalWhatsappUrl = json.data.whatsappUrl || fallbackWhatsappUrl;
      }
    }
  } catch {
    // Backend offline
  }

  // 2. Persist in localStorage
  const existing = readStorage<LuggageBookingConfirmation[]>(STORAGE_KEYS.BOOKINGS, []);
  const updated = [finalBooking, ...existing.filter(b => b.id !== finalBooking.id)];
  writeStorage(STORAGE_KEYS.BOOKINGS, updated);

  return {
    booking: finalBooking,
    whatsappUrl: finalWhatsappUrl
  };
}

export async function fetchLuggageBookings(): Promise<LuggageBookingConfirmation[]> {
  let backendBookings: LuggageBookingConfirmation[] = [];

  // 1. Try Backend
  try {
    const res = await fetch(`${API_BASE}/storage/bookings`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data)) {
        backendBookings = json.data;
      }
    }
  } catch {
    // Backend offline
  }

  // 2. Merge with localStorage
  const localBookings = readStorage<LuggageBookingConfirmation[]>(STORAGE_KEYS.BOOKINGS, []);
  const mergedMap = new Map<string, LuggageBookingConfirmation>();

  backendBookings.forEach(b => mergedMap.set(b.id || b.bookingReference, b));
  localBookings.forEach(b => mergedMap.set(b.id || b.bookingReference, b));

  const mergedList = Array.from(mergedMap.values()).sort(
    (a, b) => (new Date(b.dropoffTime || 0).getTime()) - (new Date(a.dropoffTime || 0).getTime())
  );

  writeStorage(STORAGE_KEYS.BOOKINGS, mergedList);
  return mergedList;
}

export async function updateLuggageBookingStatus(bookingId: string, status: string): Promise<boolean> {
  // 1. Send to Backend
  try {
    await fetch(`${API_BASE}/storage/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  } catch {
    // Backend offline
  }

  // 2. Update in localStorage
  const current = readStorage<LuggageBookingConfirmation[]>(STORAGE_KEYS.BOOKINGS, []);
  const idx = current.findIndex(b => b.id === bookingId || b.bookingReference === bookingId);
  if (idx !== -1) {
    current[idx].status = status;
    writeStorage(STORAGE_KEYS.BOOKINGS, current);
    return true;
  }

  return false;
}

/* =========================================================================
   SMART MULTILINGUAL WHATSAPP MESSAGE GENERATOR
   ========================================================================= */

export function generateCartWhatsAppUrl(
  items: CartItem[],
  customerName: string,
  customerPhone: string,
  deliveryOption: 'pickup' | 'local_delivery',
  notes?: string,
  lang: string = 'pt'
): string {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const isPt = lang === 'pt';
  const isEs = lang === 'es';

  const titleHeader = isPt
    ? `🛍️ *NOVA ENCOMENDA - Mercado De Camões Porto*`
    : isEs
      ? `🛍️ *NUEVO PEDIDO - Mercado De Camões Porto*`
      : `🛍️ *NEW ORDER - Mercado De Camões Porto*`;

  const customerLabel = isPt ? `👤 *Cliente:*` : isEs ? `👤 *Cliente:*` : `👤 *Customer:*`;
  const contactLabel = isPt ? `📞 *Contacto:*` : isEs ? `📞 *Teléfono:*` : `📞 *Contact:*`;
  const optionLabel = isPt
    ? `🚚 *Modalidade:* ${deliveryOption === 'pickup' ? 'Levantamento na Loja (Rua Camões 242)' : 'Entrega no Alojamento / Hotel'}`
    : isEs
      ? `🚚 *Modalidad:* ${deliveryOption === 'pickup' ? 'Recogida en Tienda (Rua Camões 242)' : 'Entrega en Alojamiento / Hotel'}`
      : `🚚 *Option:* ${deliveryOption === 'pickup' ? 'Store Pickup (Rua Camões 242)' : 'Local Delivery to Accommodation'}`;

  const notesLine = notes ? (isPt ? `📝 *Observações:* ${notes}\n` : `📝 *Notes:* ${notes}\n`) : '';
  const itemsHeader = isPt ? `🛒 *Artigos Encomendados:*` : isEs ? `🛒 *Artículos:*` : `🛒 *Items Ordered:*`;

  const itemList = items
    .map((item, idx) => {
      const prodName = isPt ? item.product.name_pt : item.product.name_en;
      return `${idx + 1}. ${prodName} ×${item.quantity} — €${(item.product.price * item.quantity).toFixed(2)}`;
    })
    .join('\n');

  const totalLabel = isPt ? `💰 *TOTAL PREVISTO:*` : isEs ? `💰 *TOTAL ESTIMADO:*` : `💰 *ESTIMATED TOTAL:*`;
  const footerMessage = isPt
    ? `📍 *Localização:* Rua Camões 242, 4000-140 Porto\nPor favor confirmem a disponibilidade do pedido. Obrigado!`
    : isEs
      ? `📍 *Ubicación:* Rua Camões 242, 4000-140 Porto\nPor favor confirmen disponibilidad del pedido. ¡Muchas gracias!`
      : `📍 *Location:* Rua Camões 242, 4000-140 Porto, Portugal\nPlease confirm order availability and ETA. Thank you!`;

  const text = `${titleHeader}
----------------------------------------
${customerLabel} ${customerName || (isPt ? 'Cliente' : 'Customer')}
${contactLabel} ${customerPhone || 'N/A'}
${optionLabel}
${notesLine}${itemsHeader}
${itemList}

${totalLabel} €${total.toFixed(2)}
----------------------------------------
${footerMessage}`;

  return `https://wa.me/351920319177?text=${encodeURIComponent(text)}`;
}

/* =========================================================================
   ADMIN AUTHENTICATION & SECURITY
   ========================================================================= */

export const AUTHORIZED_ADMIN_CREDENTIALS = {
  phone: '+351 920 319 177',
  password: 'admin@12345'
};

const ADMIN_TOKEN_KEY = 'mc_admin_session_token';

export async function loginAdmin(
  identifier: string,
  password: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    const json = await res.json();
    if (res.ok && json.success) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(ADMIN_TOKEN_KEY, json.data.token);
      }
      return { success: true, token: json.data.token };
    }
    return { success: false, error: json.error || 'Credenciais inválidas' };
  } catch {
    // Client-side fallback if backend is unreachable
    const cleanInput = identifier.trim().replace(/\s+/g, '');
    const validClean = AUTHORIZED_ADMIN_CREDENTIALS.phone.replace(/\s+/g, '');
    if (
      (cleanInput === validClean || cleanInput === '351920319177' || cleanInput.toLowerCase() === 'admin') &&
      password === AUTHORIZED_ADMIN_CREDENTIALS.password
    ) {
      const fallbackToken = btoa(
        JSON.stringify({ phone: '+351 920 319 177', role: 'SUPER_ADMIN', expiresAt: Date.now() + 86400000 * 7 })
      );
      if (typeof window !== 'undefined') {
        localStorage.setItem(ADMIN_TOKEN_KEY, fallbackToken);
      }
      return { success: true, token: fallbackToken };
    }
    return {
      success: false,
      error: 'Credenciais inválidas. Apenas o administrador autorizado (+351 920 319 177) pode aceder.'
    };
  }
}

export function getStoredAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function isStoredAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (!token) return false;
  try {
    const decoded = JSON.parse(atob(token));
    return decoded && decoded.role === 'SUPER_ADMIN' && (!decoded.expiresAt || decoded.expiresAt > Date.now());
  } catch {
    return false;
  }
}

export function logoutAdmin(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  }
}
