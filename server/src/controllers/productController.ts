import { Request, Response } from 'express';
import { productService } from '../services/productService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, featured, search, limit, offset, lang } = req.query;

    const isFeatured = featured !== undefined ? featured === 'true' : undefined;
    const limitNum = limit ? parseInt(limit as string, 10) : 50;
    const offsetNum = offset ? parseInt(offset as string, 10) : 0;

    const result = await productService.getProducts({
      categorySlug: category as string,
      isFeatured,
      search: search as string,
      lang: (lang as 'en' | 'pt') || 'en',
      limit: limitNum,
      offset: offsetNum
    });

    return sendSuccess(res, result.products, 'Products fetched successfully', 200, {
      total: result.total,
      limit: limitNum,
      offset: offsetNum
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch products', 500);
  }
};

export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 8;
    const products = await productService.getFeaturedProducts(limit);
    return sendSuccess(res, products);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch featured products', 500);
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    if (!product) {
      return sendError(res, `Product '${id}' not found`, 404);
    }
    return sendSuccess(res, product);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch product', 500);
  }
};
