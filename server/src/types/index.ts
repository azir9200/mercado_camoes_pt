export type Language = 'en' | 'pt';

export interface CategoryDTO {
  id: string;
  slug: string;
  name_en: string;
  name_pt: string;
  description_en?: string;
  description_pt?: string;
  icon?: string;
  displayOrder: number;
}

export interface ProductImageDTO {
  id: string;
  url: string;
  alt_en?: string;
  alt_pt?: string;
  isPrimary: boolean;
}

export interface ProductDTO {
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
  category?: CategoryDTO;
  images: ProductImageDTO[];
}

export type DurationType = '1h' | '3h' | '1d' | 'custom';

export interface LuggageBookingRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  whatsapp?: string;
  bagCount: number;
  durationType: DurationType;
  durationHours: number;
  dropoffTime: string; // ISO date string
  notes?: string;
}

export interface LuggageBookingDTO extends LuggageBookingRequest {
  id: string;
  bookingReference: string;
  pickupTime: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'STORED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface CartItemOrder {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderCheckoutRequest {
  customerName: string;
  customerPhone: string;
  deliveryOption: 'pickup' | 'local_delivery';
  notes?: string;
  items: CartItemOrder[];
}
