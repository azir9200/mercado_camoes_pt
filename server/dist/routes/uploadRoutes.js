"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const response_js_1 = require("../utils/response.js");
const uploadController_js_1 = require("../controllers/uploadController.js");
const requireAdmin_js_1 = require("../middleware/requireAdmin.js");
const router = (0, express_1.Router)();
const handleProductImageUpload = (req, res, next) => {
    uploadController_js_1.productImageUpload.single('image')(req, res, (error) => {
        if (!error)
            return next();
        if (error instanceof multer_1.default.MulterError) {
            const statusCode = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
            return (0, response_js_1.sendError)(res, error.message, statusCode);
        }
        return (0, response_js_1.sendError)(res, error instanceof Error ? error.message : 'Invalid image upload.', 400);
    });
};
router.post('/product-image', requireAdmin_js_1.requireAdmin, handleProductImageUpload, uploadController_js_1.uploadProductImage);
router.get('/products/:filename', uploadController_js_1.getProductImage);
exports.default = router;
