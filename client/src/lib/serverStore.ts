import { Category, Product, StoreInfo, Order, LuggageBookingConfirmation } from '../types';
import { initialCategories, initialProducts, initialStoreInfo } from './mockData';

export interface AppServerData {
  categories: Category[];
  products: Product[];
  storeInfo: StoreInfo;
  orders: Order[];
  bookings: LuggageBookingConfirmation[];
}

// Global singleton to persist in memory across Next.js dev server hot-reloads
declare global {
  var __mc_server_data: AppServerData | undefined;
}

function initData(): AppServerData {
  return {
    categories: [...initialCategories],
    products: [...initialProducts],
    storeInfo: JSON.parse(JSON.stringify(initialStoreInfo)),
    orders: [], // CLEAN: No dummy test orders
    bookings: [] // CLEAN: No dummy test bookings
  };
}

if (!global.__mc_server_data) {
  global.__mc_server_data = initData();
}

const dataStore = global.__mc_server_data;

export const serverStore = {
  // --- Products ---
  getProducts(params?: { category?: string; featured?: boolean; search?: string }) {
    let list = [...dataStore.products];
    if (params?.category) {
      list = list.filter(p => p.categoryId === params.category || p.category?.slug === params.category);
    }
    if (params?.featured !== undefined) {
      list = list.filter(p => Boolean(p.isFeatured) === Boolean(params.featured));
    }
    if (params?.search && params.search.trim().length > 0) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        p =>
          p.name_en.toLowerCase().includes(q) ||
          p.name_pt.toLowerCase().includes(q) ||
          p.description_en?.toLowerCase().includes(q) ||
          p.description_pt?.toLowerCase().includes(q)
      );
    }
    return list;
  },

  getProductById(id: string) {
    return dataStore.products.find(p => p.id === id || p.sku === id) || null;
  },

  createProduct(prod: Partial<Product>) {
    const id = `prod-${Date.now()}`;
    const newProd: Product = {
      id,
      sku: prod.sku || `MC-${Math.floor(1000 + Math.random() * 9000)}`,
      name_en: prod.name_en || 'Product',
      name_pt: prod.name_pt || 'Produto',
      description_en: prod.description_en || '',
      description_pt: prod.description_pt || '',
      price: Number(prod.price) || 0,
      stock: Number(prod.stock) || 50,
      unit: prod.unit || 'item',
      isFeatured: !!prod.isFeatured,
      categoryId: prod.categoryId || 'cat-food-grocery',
      images: prod.images || [
        {
          id: `img-${Date.now()}`,
          url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
          isPrimary: true
        }
      ]
    };
    dataStore.products.unshift(newProd);
    return newProd;
  },

  updateProduct(id: string, updates: Partial<Product>) {
    const idx = dataStore.products.findIndex(p => p.id === id || p.sku === id);
    if (idx === -1) return null;
    dataStore.products[idx] = { ...dataStore.products[idx], ...updates };
    return dataStore.products[idx];
  },

  deleteProduct(id: string) {
    const idx = dataStore.products.findIndex(p => p.id === id || p.sku === id);
    if (idx === -1) return false;
    dataStore.products.splice(idx, 1);
    return true;
  },

  // --- Categories ---
  getCategories() {
    return [...dataStore.categories].sort((a, b) => a.displayOrder - b.displayOrder);
  },

  createCategory(cat: Partial<Category>) {
    const newCat: Category = {
      id: `cat-${cat.slug || Date.now()}`,
      slug: cat.slug || `category-${Date.now()}`,
      name_en: cat.name_en || 'Category',
      name_pt: cat.name_pt || 'Categoria',
      description_en: cat.description_en,
      description_pt: cat.description_pt,
      icon: cat.icon || 'ShoppingBag',
      displayOrder: dataStore.categories.length + 1
    };
    dataStore.categories.push(newCat);
    return newCat;
  },

  updateCategory(id: string, updates: Partial<Category>) {
    const idx = dataStore.categories.findIndex(c => c.id === id || c.slug === id);
    if (idx === -1) return null;
    dataStore.categories[idx] = { ...dataStore.categories[idx], ...updates };
    return dataStore.categories[idx];
  },

  deleteCategory(id: string) {
    const idx = dataStore.categories.findIndex(c => c.id === id || c.slug === id);
    if (idx === -1) return false;
    dataStore.categories.splice(idx, 1);
    return true;
  },

  // --- Store Info & Rates ---
  getStoreInfo() {
    return dataStore.storeInfo;
  },

  updateRates(rates: Partial<{ oneHour: number; threeHours: number; oneDay: number; extraHour: number }>) {
    if (rates.oneHour !== undefined) dataStore.storeInfo.luggageRates.oneHour = Number(rates.oneHour);
    if (rates.threeHours !== undefined) dataStore.storeInfo.luggageRates.threeHours = Number(rates.threeHours);
    if (rates.oneDay !== undefined) dataStore.storeInfo.luggageRates.oneDay = Number(rates.oneDay);
    if (rates.extraHour !== undefined) dataStore.storeInfo.luggageRates.extraHour = Number(rates.extraHour);
    return dataStore.storeInfo.luggageRates;
  },

  // --- Orders ---
  getOrders() {
    return [...dataStore.orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createOrder(orderData: any) {
    const total = orderData.items.reduce((sum: number, item: any) => sum + item.quantity * item.unitPrice, 0);
    const orderNumber = `MC-ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: orderData.customerName || 'Cliente',
      customerPhone: orderData.customerPhone || '',
      deliveryOption: orderData.deliveryOption || 'pickup',
      notes: orderData.notes,
      items: orderData.items,
      totalPrice: Number(total.toFixed(2)),
      status: 'PENDING',
      orderType: orderData.orderType || 'DIRECT',
      createdAt: new Date().toISOString()
    };

    dataStore.orders.unshift(newOrder);
    return newOrder;
  },

  updateOrderStatus(orderId: string, status: any) {
    const order = dataStore.orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;
    order.status = status;
    return order;
  },

  // --- Luggage Bookings ---
  getBookings() {
    return [...dataStore.bookings].sort((a, b) => new Date(b.dropoffTime || 0).getTime() - new Date(a.dropoffTime || 0).getTime());
  },

  createBooking(booking: any) {
    const rates = dataStore.storeInfo.luggageRates;
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

    const newBooking: LuggageBookingConfirmation = {
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

    dataStore.bookings.unshift(newBooking);
    return newBooking;
  },

  updateBookingStatus(idOrRef: string, status: any) {
    const booking = dataStore.bookings.find(b => b.id === idOrRef || b.bookingReference === idOrRef);
    if (!booking) return null;
    booking.status = status;
    return booking;
  }
};
