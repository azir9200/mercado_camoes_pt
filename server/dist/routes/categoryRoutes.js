"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_js_1 = require("../controllers/categoryController.js");
const router = (0, express_1.Router)();
router.get('/', categoryController_js_1.getCategories);
router.get('/:slug', categoryController_js_1.getCategoryBySlug);
exports.default = router;
