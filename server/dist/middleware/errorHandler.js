"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const zod_1 = require("zod");
const response_js_1 = require("../utils/response.js");
const errorHandler = (err, req, res, next) => {
    console.error('Unhandled API Error:', err);
    if (err instanceof zod_1.ZodError) {
        return (0, response_js_1.sendError)(res, 'Validation Error', 422, err.errors.map(e => ({ path: e.path.join('.'), message: e.message })));
    }
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return (0, response_js_1.sendError)(res, message, statusCode);
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    return (0, response_js_1.sendError)(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};
exports.notFoundHandler = notFoundHandler;
