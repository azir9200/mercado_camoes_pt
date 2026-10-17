"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryBySlug = exports.getCategories = void 0;
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
const createCategory = async (req, res) => {
    try {
        const { name_en, name_pt, slug, icon, description_en, description_pt, displayOrder } = req.body;
        if (!name_en || !name_pt || !slug) {
            return (0, response_js_1.sendError)(res, 'Name (EN/PT) and slug are required', 400);
        }
        const created = await categoryService_js_1.categoryService.createCategory({
            name_en,
            name_pt,
            slug,
            icon: icon || 'Tag',
            description_en,
            description_pt,
            displayOrder: displayOrder ? parseInt(displayOrder, 10) : undefined
        });
        return (0, response_js_1.sendSuccess)(res, created, 'Category created', 201);
    }
    catch (error) {
        return (0, response_js_1.sendError)(res, error.message || 'Failed to create category', 500);
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await categoryService_js_1.categoryService.updateCategory(id, req.body);
        if (!updated) {
            return (0, response_js_1.sendError)(res, `Category '${id}' not found`, 404);
        }
        return (0, response_js_1.sendSuccess)(res, updated, 'Category updated');
    }
    catch (error) {
        return (0, response_js_1.sendError)(res, error.message || 'Failed to update category', 500);
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await categoryService_js_1.categoryService.deleteCategory(id);
        if (!deleted) {
            return (0, response_js_1.sendError)(res, `Category '${id}' not found`, 404);
        }
        return (0, response_js_1.sendSuccess)(res, { id }, 'Category deleted');
    }
    catch (error) {
        return (0, response_js_1.sendError)(res, error.message || 'Failed to delete category', 500);
    }
};
exports.deleteCategory = deleteCategory;
