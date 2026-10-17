"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getFeaturedProducts = exports.getProducts = void 0;
const productService_js_1 = require("../services/productService.js");
const response_js_1 = require("../utils/response.js");
const getProducts = async (req, res) => {
    try {
        const { category, featured, search, limit, offset, lang } = req.query;
        const isFeatured = featured !== undefined ? featured === 'true' : undefined;
        const limitNum = limit ? parseInt(limit, 10) : 50;
        const offsetNum = offset ? parseInt(offset, 10) : 0;
        const result = await productService_js_1.productService.getProducts({
            categorySlug: category,
            isFeatured,
            search: search,
            lang: lang || 'en',
            limit: limitNum,
            offset: offsetNum
        });
        return (0, response_js_1.sendSuccess)(res, result.products, 'Products fetched successfully', 200, {
            total: result.total,
            limit: limitNum,
            offset: offsetNum
        });
    }
    catch (error) {
        return (0, response_js_1.sendError)(res, error.message || 'Failed to fetch products', 500);
    }
};
exports.getProducts = getProducts;
const getFeaturedProducts = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 8;
        const products = await productService_js_1.productService.getFeaturedProducts(limit);
        return (0, response_js_1.sendSuccess)(res, products);
    }
    catch (error) {
        return (0, response_js_1.sendError)(res, error.message || 'Failed to fetch featured products', 500);
    }
};
exports.getFeaturedProducts = getFeaturedProducts;
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productService_js_1.productService.getProductById(id);
        if (!product) {
            return (0, response_js_1.sendError)(res, `Product '${id}' not found`, 404);
        }
        return (0, response_js_1.sendSuccess)(res, product);
    }
    catch (error) {
        return (0, response_js_1.sendError)(res, error.message || 'Failed to fetch product', 500);
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    try {
        const { name_en, name_pt, price, categoryId, description_en, description_pt, stock, unit, isFeatured, images, sku } = req.body;
        if (!name_en || !name_pt || price === undefined || !categoryId) {
            return (0, response_js_1.sendError)(res, 'Name (EN/PT), price, and category are required', 400);
        }
        const newProd = await productService_js_1.productService.createProduct({
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
        return (0, response_js_1.sendSuccess)(res, newProd, 'Product created successfully', 201);
    }
    catch (error) {
        return (0, response_js_1.sendError)(res, error.message || 'Failed to create product', 500);
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await productService_js_1.productService.updateProduct(id, req.body);
        if (!updated) {
            return (0, response_js_1.sendError)(res, `Product '${id}' not found`, 404);
        }
        return (0, response_js_1.sendSuccess)(res, updated, 'Product updated successfully');
    }
    catch (error) {
        return (0, response_js_1.sendError)(res, error.message || 'Failed to update product', 500);
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await productService_js_1.productService.deleteProduct(id);
        if (!deleted) {
            return (0, response_js_1.sendError)(res, `Product '${id}' not found`, 404);
        }
        return (0, response_js_1.sendSuccess)(res, { id }, 'Product deleted successfully');
    }
    catch (error) {
        return (0, response_js_1.sendError)(res, error.message || 'Failed to delete product', 500);
    }
};
exports.deleteProduct = deleteProduct;
