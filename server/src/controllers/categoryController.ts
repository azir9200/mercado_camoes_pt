import { Request, Response } from 'express';
import { categoryService } from '../services/categoryService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();
    return sendSuccess(res, categories, 'Categories fetched successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch categories', 500);
  }
};

export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const category = await categoryService.getCategoryBySlug(slug);
    if (!category) {
      return sendError(res, `Category '${slug}' not found`, 404);
    }
    return sendSuccess(res, category);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch category', 500);
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name_en, name_pt, slug, icon, description_en, description_pt, displayOrder } = req.body;
    if (!name_en || !name_pt || !slug) {
      return sendError(res, 'Name (EN/PT) and slug are required', 400);
    }

    const created = await categoryService.createCategory({
      name_en,
      name_pt,
      slug,
      icon: icon || 'Tag',
      description_en,
      description_pt,
      displayOrder: displayOrder ? parseInt(displayOrder, 10) : undefined as any
    });

    return sendSuccess(res, created, 'Category created', 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create category', 500);
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await categoryService.updateCategory(id, req.body);
    if (!updated) {
      return sendError(res, `Category '${id}' not found`, 404);
    }
    return sendSuccess(res, updated, 'Category updated');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update category', 500);
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await categoryService.deleteCategory(id);
    if (!deleted) {
      return sendError(res, `Category '${id}' not found`, 404);
    }
    return sendSuccess(res, { id }, 'Category deleted');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to delete category', 500);
  }
};
