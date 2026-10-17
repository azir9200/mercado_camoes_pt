"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = exports.ProductService = void 0;
const dbStore_js_1 = require("../data/dbStore.js");
class ProductService {
    async getProducts(params = {}) {
        let list = [...dbStore_js_1.dbStore.getProducts()];
        const categories = dbStore_js_1.dbStore.getCategories();
        // Filter by Category
        if (params.categorySlug) {
            const category = categories.find(c => c.slug === params.categorySlug || c.id === params.categorySlug);
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
    async getProductById(idOrSku) {
        const product = dbStore_js_1.dbStore.getProductById(idOrSku);
        if (!product)
            return null;
        return {
            ...product,
            category: dbStore_js_1.dbStore.getCategories().find(c => c.id === product.categoryId)
        };
    }
    async getFeaturedProducts(limit = 8) {
        const { products } = await this.getProducts({ isFeatured: true, limit });
        return products;
    }
    async createProduct(data) {
        const id = `prod-${Date.now()}`;
        const newProduct = {
            ...data,
            id,
            sku: data.sku || `MC-${Math.floor(1000 + Math.random() * 9000)}`
        };
        dbStore_js_1.dbStore.createProduct(newProduct);
        return {
            ...newProduct,
            category: dbStore_js_1.dbStore.getCategories().find(c => c.id === newProduct.categoryId)
        };
    }
    async updateProduct(id, data) {
        const updated = dbStore_js_1.dbStore.updateProduct(id, data);
        if (!updated)
            return null;
        return {
            ...updated,
            category: dbStore_js_1.dbStore.getCategories().find(c => c.id === updated.categoryId)
        };
    }
    async deleteProduct(id) {
        return dbStore_js_1.dbStore.deleteProduct(id);
    }
}
exports.ProductService = ProductService;
exports.productService = new ProductService();
