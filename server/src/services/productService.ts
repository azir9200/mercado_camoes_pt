import { dbStore } from '../data/dbStore.js';
import { ProductDTO } from '../types/index.js';

export interface ProductFilterParams {
  categorySlug?: string;
  isFeatured?: boolean;
  search?: string;
  lang?: 'en' | 'pt';
  limit?: number;
  offset?: number;
}

export class ProductService {
  async getProducts(params: ProductFilterParams = {}): Promise<{ products: ProductDTO[]; total: number }> {
    let list = [...dbStore.getProducts()];
    const categories = dbStore.getCategories();

    // Filter by Category
    if (params.categorySlug) {
      const category = categories.find(c => c.slug === params.categorySlug || c.id === params.categorySlug);
      if (category) {
        list = list.filter(p => p.categoryId === category.id);
      } else {
        list = [];
      }
    }

    // Filter by Featured
    if (typeof params.isFeatured === 'boolean') {
      list = list.filter(p => p.isFeatured === params.isFeatured);
    }

    // Search in names and descriptions (EN/PT)
    if (params.search && params.search.trim().length > 0) {
      const term = params.search.toLowerCase().trim();
      list = list.filter(p =>
        p.name_en.toLowerCase().includes(term) ||
        p.name_pt.toLowerCase().includes(term) ||
        p.description_en.toLowerCase().includes(term) ||
        p.description_pt.toLowerCase().includes(term)
      );
    }

    // Attach category details
    const populated = list.map(p => ({
      ...p,
      category: categories.find(c => c.id === p.categoryId)
    }));

    const total = populated.length;
    const offset = params.offset || 0;
    const limit = params.limit || 50;
    const paginated = populated.slice(offset, offset + limit);

    return {
      products: paginated,
      total
    };
  }

  async getProductById(idOrSku: string): Promise<ProductDTO | null> {
    const product = dbStore.getProductById(idOrSku);
    if (!product) return null;

    return {
      ...product,
      category: dbStore.getCategories().find(c => c.id === product.categoryId)
    };
  }

  async getFeaturedProducts(limit = 8): Promise<ProductDTO[]> {
    const { products } = await this.getProducts({ isFeatured: true, limit });
    return products;
  }

  async createProduct(data: Omit<ProductDTO, 'id'>): Promise<ProductDTO> {
    const id = `prod-${Date.now()}`;
    const newProduct: ProductDTO = {
      ...data,
      id,
      sku: data.sku || `MC-${Math.floor(1000 + Math.random() * 9000)}`
    };
    dbStore.createProduct(newProduct);
    return {
      ...newProduct,
      category: dbStore.getCategories().find(c => c.id === newProduct.categoryId)
    };
  }

  async updateProduct(id: string, data: Partial<ProductDTO>): Promise<ProductDTO | null> {
    const updated = dbStore.updateProduct(id, data);
    if (!updated) return null;

    return {
      ...updated,
      category: dbStore.getCategories().find(c => c.id === updated.categoryId)
    };
  }

  async deleteProduct(id: string): Promise<boolean> {
    return dbStore.deleteProduct(id);
  }
}

export const productService = new ProductService();
