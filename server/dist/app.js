"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_js_1 = require("./config/index.js");
const apiRoutes_js_1 = __importDefault(require("./routes/apiRoutes.js"));
const errorHandler_js_1 = require("./middleware/errorHandler.js");
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)({
    origin: [index_js_1.config.clientUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Request Logger in dev
if (index_js_1.config.nodeEnv === 'development') {
    app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        next();
    });
}
// API Routes
app.use('/api/v1', apiRoutes_js_1.default);
// Root Welcome Route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Mercado Camões API',
        documentation: '/api/v1/health',
        endpoints: {
            categories: '/api/v1/categories',
            products: '/api/v1/products',
            featured: '/api/v1/products/featured',
            luggageStorage: '/api/v1/storage',
            store: '/api/v1/store/info'
        }
    });
});
// Error handling
app.use(errorHandler_js_1.notFoundHandler);
app.use(errorHandler_js_1.errorHandler);
exports.default = app;
