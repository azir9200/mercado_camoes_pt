export type Language = 'en' | 'pt';

export interface Category {
  id: string;
  slug: string;
  name_en: string;
  name_pt: string;
  description_en?: string;
  description_pt?: string;
  icon?: string;
  displayOrder: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt_en?: string;
  alt_pt?: string;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  sku?: string;
  name_en: string;
  name_pt: string;
  description_en: string;
  description_pt: string;
  price: number;
  stock: number;
  unit: string;
  isFeatured: boolean;
  categoryId: string;
  category?: Category;
  images: ProductImage[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type StorageDurationOption = '1h' | '3h' | '1d' | 'custom';

export interface LuggageQuoteResult {
  bagCount: number;
  durationHours: number;
  durationType: StorageDurationOption;
  pricePerBag: number;
  totalPrice: number;
  breakdown: string;
}

export interface LuggageBookingFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  whatsapp?: string;
  bagCount: number;
  durationType: StorageDurationOption;
  durationHours: number;
  dropoffTime: string;
  notes?: string;
}

export interface LuggageBookingConfirmation {
  id: string;
  bookingReference: string;
  customerName: string;
  bagCount: number;
  durationType: string;
  durationHours: number;
  dropoffTime: string;
  pickupTime: string;
  totalPrice: number;
  status: string;
  notes?: string;
}

export interface StoreInfo {
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  openingHours: {
    en: string;
    pt: string;
  };
  geo: {
    lat: number;
    lng: number;
    googleMapsUrl: string;
  };
  luggageRates: {
    oneHour: number;
    threeHours: number;
    oneDay: number;
    extraHour: number;
  };
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryOption: 'pickup' | 'local_delivery';
  notes?: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  orderType: 'WHATSAPP' | 'DIRECT';
  createdAt: string;
}
