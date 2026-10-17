import fs from 'fs';
import path from 'path';
import { CategoryDTO, ProductDTO, LuggageBookingDTO, OrderDTO } from '../types/index.js';
import { mockCategories, mockProducts, mockBookings, mockOrders } from './mockDatabase.js';
import { config } from '../config/index.js';

const getDbFilePath = (): string => {
  const directPath = path.resolve(process.cwd(), 'src', 'data', 'database.json');
  if (fs.existsSync(path.resolve(process.cwd(), 'src', 'data'))) {
    return directPath;
  }
  const monorepoPath = path.resolve(process.cwd(), 'server', 'src', 'data', 'database.json');
  return monorepoPath;
};

const DB_FILE = getDbFilePath();

export interface DatabaseSchema {
  categories: CategoryDTO[];
  products: ProductDTO[];
  bookings: LuggageBookingDTO[];
  orders: OrderDTO[];
  rates: {
    oneHour: number;
    threeHours: number;
    oneDay: number;
    extraHour: number;
  };
}

class DatabaseStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(content);
        return {
          categories: parsed.categories || mockCategories,
          products: parsed.products || mockProducts,
          bookings: parsed.bookings || mockBookings,
          orders: parsed.orders || mockOrders,
          rates: parsed.rates || config.store.luggageRates
        };
      }
    } catch (err) {
      console.warn('⚠️ Could not load database.json, initializing fresh store:', err);
    }

    const initialData: DatabaseSchema = {
      categories: [...mockCategories],
      products: [...mockProducts],
      bookings: [...mockBookings],
      orders: [...mockOrders],
      rates: { ...config.store.luggageRates }
    };

    this.saveDirect(initialData);
    return initialData;
  }

  private save(): void {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('❌ Failed to write to database.json:', err);
    }
  }

  private saveDirect(data: DatabaseSchema): void {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('❌ Failed to save initial database.json:', err);
    }
  }

  // --- Products ---
  getProducts(): ProductDTO[] {
    return this.data.products;
  }

  getProductById(id: string): ProductDTO | undefined {
    return this.data.products.find(p => p.id === id || p.sku === id);
  }

  createProduct(product: ProductDTO): ProductDTO {
    this.data.products.unshift(product);
    this.save();
    return product;
  }

  updateProduct(id: string, updates: Partial<ProductDTO>): ProductDTO | null {
    const idx = this.data.products.findIndex(p => p.id === id || p.sku === id);
    if (idx === -1) return null;
    this.data.products[idx] = { ...this.data.products[idx], ...updates };
    this.save();
    return this.data.products[idx];
  }

  deleteProduct(id: string): boolean {
    const idx = this.data.products.findIndex(p => p.id === id || p.sku === id);
    if (idx === -1) return false;
    this.data.products.splice(idx, 1);
    this.save();
    return true;
  }

  // --- Categories ---
  getCategories(): CategoryDTO[] {
    return this.data.categories;
  }

  getCategoryBySlug(slug: string): CategoryDTO | undefined {
    return this.data.categories.find(c => c.slug === slug || c.id === slug);
  }

  createCategory(category: CategoryDTO): CategoryDTO {
    this.data.categories.push(category);
    this.save();
    return category;
  }

  updateCategory(id: string, updates: Partial<CategoryDTO>): CategoryDTO | null {
    const idx = this.data.categories.findIndex(c => c.id === id || c.slug === id);
    if (idx === -1) return null;
    this.data.categories[idx] = { ...this.data.categories[idx], ...updates };
    this.save();
    return this.data.categories[idx];
  }

  deleteCategory(id: string): boolean {
    const idx = this.data.categories.findIndex(c => c.id === id || c.slug === id);
    if (idx === -1) return false;
    this.data.categories.splice(idx, 1);
    this.save();
    return true;
  }

  // --- Luggage Bookings ---
  getBookings(): LuggageBookingDTO[] {
    return this.data.bookings;
  }

  getBookingByReference(ref: string): LuggageBookingDTO | undefined {
    return this.data.bookings.find(b => b.bookingReference === ref || b.id === ref);
  }

  createBooking(booking: LuggageBookingDTO): LuggageBookingDTO {
    this.data.bookings.unshift(booking);
    this.save();
    return booking;
  }

  updateBookingStatus(idOrRef: string, status: any): LuggageBookingDTO | null {
    const b = this.data.bookings.find(item => item.id === idOrRef || item.bookingReference === idOrRef);
    if (!b) return null;
    b.status = status;
    this.save();
    return b;
  }

  // --- Orders ---
  getOrders(): OrderDTO[] {
    return this.data.orders;
  }

  getOrderById(idOrNum: string): OrderDTO | undefined {
    return this.data.orders.find(o => o.id === idOrNum || o.orderNumber === idOrNum);
  }

  createOrder(order: OrderDTO): OrderDTO {
    this.data.orders.unshift(order);
    this.save();
    return order;
  }

  updateOrderStatus(idOrNum: string, status: any): OrderDTO | null {
    const o = this.data.orders.find(item => item.id === idOrNum || item.orderNumber === idOrNum);
    if (!o) return null;
    o.status = status;
    this.save();
    return o;
  }

  // --- Luggage Rates ---
  getRates() {
    return this.data.rates;
  }

  updateRates(rates: Partial<{ oneHour: number; threeHours: number; oneDay: number; extraHour: number }>) {
    this.data.rates = { ...this.data.rates, ...rates };
    this.save();
    return this.data.rates;
  }
}

export const dbStore = new DatabaseStore();
