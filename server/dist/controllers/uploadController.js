"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductImage = exports.uploadProductImage = exports.productImageUpload = void 0;
const node_crypto_1 = require("node:crypto");
const promises_1 = require("node:fs/promises");
const node_path_1 = __importDefault(require("node:path"));
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const response_js_1 = require("../utils/response.js");
const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const SUPPORTED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const SUPPORTED_FORMATS = new Set(['jpeg', 'png', 'webp', 'avif']);
const WEBP_FILENAME = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp$/i;
exports.productImageUpload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: MAX_IMAGE_SIZE, files: 1 },
    fileFilter: (_req, file, callback) => {
        if (!SUPPORTED_MIME_TYPES.has(file.mimetype)) {
            callback(new Error('Use a JPEG, PNG, WebP, or AVIF image.'));
            return;
        }
        callback(null, true);
    }
});
const uploadProductImage = async (req, res) => {
    const file = req.file;
    if (!file)
        return (0, response_js_1.sendError)(res, 'Select an image to upload.', 400);
    const input = file.buffer;
    let metadata;
    try {
        metadata = await (0, sharp_1.default)(input, { limitInputPixels: 40_000_000 }).metadata();
    }
    catch {
        return (0, response_js_1.sendError)(res, 'The selected file is not a valid image.', 400);
    }
    if (!metadata.format || !SUPPORTED_FORMATS.has(metadata.format)) {
        return (0, response_js_1.sendError)(res, 'Use a JPEG, PNG, WebP, or AVIF image.', 415);
    }
    try {
        const uploadDirectory = process.env.PRODUCT_UPLOAD_DIR
            ? node_path_1.default.resolve(process.env.PRODUCT_UPLOAD_DIR)
            : node_path_1.default.join(process.cwd(), 'src', 'data', 'uploads', 'products');
        const fileName = `${(0, node_crypto_1.randomUUID)()}.webp`;
        await (0, promises_1.mkdir)(uploadDirectory, { recursive: true });
        await (0, sharp_1.default)(input, { limitInputPixels: 40_000_000 })
            .rotate()
            .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 82, effort: 4 })
            .toFile(node_path_1.default.join(uploadDirectory, fileName));
        return (0, response_js_1.sendSuccess)(res, { url: `/api/v1/uploads/products/${fileName}` });
    }
    catch {
        return (0, response_js_1.sendError)(res, 'Image upload failed. Please try again.', 500);
    }
};
exports.uploadProductImage = uploadProductImage;
const getProductImage = async (req, res) => {
    const { filename } = req.params;
    if (!WEBP_FILENAME.test(filename))
        return (0, response_js_1.sendError)(res, 'Image not found.', 404);
    const uploadDirectory = process.env.PRODUCT_UPLOAD_DIR
        ? node_path_1.default.resolve(process.env.PRODUCT_UPLOAD_DIR)
        : node_path_1.default.join(process.cwd(), 'src', 'data', 'uploads', 'products');
    try {
        const image = await (0, promises_1.readFile)(node_path_1.default.join(uploadDirectory, filename));
        return res
            .status(200)
            .type('image/webp')
            .set('Cache-Control', 'public, max-age=31536000, immutable')
            .set('X-Content-Type-Options', 'nosniff')
            .send(image);
    }
    catch {
        return (0, response_js_1.sendError)(res, 'Image not found.', 404);
    }
};
exports.getProductImage = getProductImage;
