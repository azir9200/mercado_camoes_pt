"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = exports.CategoryService = void 0;
const dbStore_js_1 = require("../data/dbStore.js");
class CategoryService {
    async getAllCategories() {
        return [...dbStore_js_1.dbStore.getCategories()].sort((a, b) => a.displayOrder - b.displayOrder);
    }
    async getCategoryBySlug(slug) {
        const category = dbStore_js_1.dbStore.getCategoryBySlug(slug);
        return category || null;
    }
    async createCategory(data) {
        const id = `cat-${data.slug || Date.now()}`;
        const newCategory = {
            ...data,
            id,
            displayOrder: data.displayOrder || dbStore_js_1.dbStore.getCategories().length + 1
        };
        dbStore_js_1.dbStore.createCategory(newCategory);
        return newCategory;
    }
    async updateCategory(id, data) {
        return dbStore_js_1.dbStore.updateCategory(id, data);
    }
    async deleteCategory(id) {
        return dbStore_js_1.dbStore.deleteCategory(id);
    }
}
exports.CategoryService = CategoryService;
exports.categoryService = new CategoryService();
