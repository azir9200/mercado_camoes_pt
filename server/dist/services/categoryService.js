"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = exports.CategoryService = void 0;
const mockDatabase_js_1 = require("../data/mockDatabase.js");
class CategoryService {
    async getAllCategories() {
        return [...mockDatabase_js_1.mockCategories].sort((a, b) => a.displayOrder - b.displayOrder);
    }
    async getCategoryBySlug(slug) {
        const category = mockDatabase_js_1.mockCategories.find(c => c.slug === slug || c.id === slug);
        return category || null;
    }
}
exports.CategoryService = CategoryService;
exports.categoryService = new CategoryService();
