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

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name_en, name_pt, price, categoryId, description_en, description_pt, stock, unit, isFeatured, images, sku } = req.body;
    if (!name_en || !name_pt || price === undefined || !categoryId) {
      return sendError(res, 'Name (EN/PT), price, and category are required', 400);
    }

    const newProd = await productService.createProduct({
      name_en,
      name_pt,
      price: parseFloat(price),
      categoryId,
      description_en: description_en || '',
      description_pt: description_pt || '',
      stock: stock !== undefined ? parseInt(stock, 10) : 50,
      unit: unit || 'item',
      isFeatured: !!isFeatured,
      images: images || [
        {
          id: `img-${Date.now()}`,
          url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
          isPrimary: true
        }
      ],
      sku
    });

    return sendSuccess(res, newProd, 'Product created successfully', 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create product', 500);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await productService.updateProduct(id, req.body);
    if (!updated) {
      return sendError(res, `Product '${id}' not found`, 404);
    }
    return sendSuccess(res, updated, 'Product updated successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update product', 500);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await productService.deleteProduct(id);
    if (!deleted) {
      return sendError(res, `Product '${id}' not found`, 404);
    }
    return sendSuccess(res, { id }, 'Product deleted successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to delete product', 500);
  }
};
