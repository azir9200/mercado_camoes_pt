import { dbStore } from '../data/dbStore.js';
import { CategoryDTO } from '../types/index.js';

export class CategoryService {
  async getAllCategories(): Promise<CategoryDTO[]> {
    return [...dbStore.getCategories()].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getCategoryBySlug(slug: string): Promise<CategoryDTO | null> {
    const category = dbStore.getCategoryBySlug(slug);
    return category || null;
  }

  async createCategory(data: Omit<CategoryDTO, 'id'>): Promise<CategoryDTO> {
    const id = `cat-${data.slug || Date.now()}`;
    const newCategory: CategoryDTO = {
      ...data,
      id,
      displayOrder: data.displayOrder || dbStore.getCategories().length + 1
    };
    dbStore.createCategory(newCategory);
    return newCategory;
  }

  async updateCategory(id: string, data: Partial<CategoryDTO>): Promise<CategoryDTO | null> {
    return dbStore.updateCategory(id, data);
  }

  async deleteCategory(id: string): Promise<boolean> {
    return dbStore.deleteCategory(id);
  }
}

export const categoryService = new CategoryService();
