import { mockCategories } from '../data/mockDatabase.js';
import { CategoryDTO } from '../types/index.js';

export class CategoryService {
  async getAllCategories(): Promise<CategoryDTO[]> {
    return [...mockCategories].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getCategoryBySlug(slug: string): Promise<CategoryDTO | null> {
    const category = mockCategories.find(c => c.slug === slug || c.id === slug);
    return category || null;
  }
}

export const categoryService = new CategoryService();
