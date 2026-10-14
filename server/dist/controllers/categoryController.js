"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryBySlug = exports.getCategories = void 0;
const categoryService_js_1 = require("../services/categoryService.js");
const response_js_1 = require("../utils/response.js");
const getCategories = async (req, res) => {
    try {
        const categories = await categoryService_js_1.categoryService.getAllCategories();
        return (0, response_js_1.sendSuccess)(res, categories, 'Categories fetched successfully');
    }
    catch (error) {
        return (0, response_js_1.sendError)(res, error.message || 'Failed to fetch categories', 500);
    }
};
exports.getCategories = getCategories;
const getCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await categoryService_js_1.categoryService.getCategoryBySlug(slug);
        if (!category) {
            return (0, response_js_1.sendError)(res, `Category '${slug}' not found`, 404);
        }
        return (0, response_js_1.sendSuccess)(res, category);
    }
    catch (error) {
        return (0, response_js_1.sendError)(res, error.message || 'Failed to fetch category', 500);
    }
};
exports.getCategoryBySlug = getCategoryBySlug;
