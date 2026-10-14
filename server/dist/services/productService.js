"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = exports.ProductService = void 0;
const mockDatabase_js_1 = require("../data/mockDatabase.js");
class ProductService {
    async getProducts(params = {}) {
        let list = [...mockDatabase_js_1.mockProducts];
        // Filter by Category
        if (params.categorySlug) {
            const category = mockDatabase_js_1.mockCategories.find(c => c.slug === params.categorySlug || c.id === params.categorySlug);
            if (category) {
                list = list.filter(p => p.categoryId === category.id);
            }
            else {
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
            list = list.filter(p => p.name_en.toLowerCase().includes(term) ||
                p.name_pt.toLowerCase().includes(term) ||
                p.description_en.toLowerCase().includes(term) ||
                p.description_pt.toLowerCase().includes(term));
        }
        // Attach category details
        const populated = list.map(p => ({
            ...p,
            category: mockDatabase_js_1.mockCategories.find(c => c.id === p.categoryId)
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
    async getProductById(idOrSku) {
        const product = mockDatabase_js_1.mockProducts.find(p => p.id === idOrSku || p.sku === idOrSku);
        if (!product)
            return null;
        return {
            ...product,
            category: mockDatabase_js_1.mockCategories.find(c => c.id === product.categoryId)
        };
    }
    async getFeaturedProducts(limit = 8) {
        const { products } = await this.getProducts({ isFeatured: true, limit });
        return products;
    }
}
exports.ProductService = ProductService;
exports.productService = new ProductService();
