"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_js_1 = require("../controllers/productController.js");
const router = (0, express_1.Router)();
router.get('/', productController_js_1.getProducts);
router.get('/featured', productController_js_1.getFeaturedProducts);
router.get('/:id', productController_js_1.getProductById);
exports.default = router;
