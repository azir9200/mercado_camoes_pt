"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryRoutes_js_1 = __importDefault(require("./categoryRoutes.js"));
const productRoutes_js_1 = __importDefault(require("./productRoutes.js"));
const bookingRoutes_js_1 = __importDefault(require("./bookingRoutes.js"));
const storeRoutes_js_1 = __importDefault(require("./storeRoutes.js"));
const orderRoutes_js_1 = __importDefault(require("./orderRoutes.js"));
const authRoutes_js_1 = __importDefault(require("./authRoutes.js"));
const apiRouter = (0, express_1.Router)();
apiRouter.use('/auth', authRoutes_js_1.default);
apiRouter.use('/categories', categoryRoutes_js_1.default);
apiRouter.use('/products', productRoutes_js_1.default);
apiRouter.use('/storage', bookingRoutes_js_1.default);
apiRouter.use('/store', storeRoutes_js_1.default);
apiRouter.use('/orders', orderRoutes_js_1.default);
// Health check endpoint
apiRouter.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'Mercado Camões API',
        version: '1.0.0'
    });
});
exports.default = apiRouter;
