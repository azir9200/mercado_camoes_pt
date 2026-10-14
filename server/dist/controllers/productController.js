"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductById = exports.getFeaturedProducts = exports.getProducts = void 0;
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
