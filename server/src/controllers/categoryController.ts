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
