"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
const index_js_1 = require("./config/index.js");
const startServer = () => {
    try {
        app_js_1.default.listen(index_js_1.config.port, () => {
            console.log(`===============================================`);
            console.log(` 🛍️  Mercado Camões API Server running!        `);
            console.log(` 🌍  Port: ${index_js_1.config.port}                      `);
            console.log(` 🌐  Client URL: ${index_js_1.config.clientUrl}           `);
            console.log(` 🔗  Endpoints: http://localhost:${index_js_1.config.port}/api/v1/health `);
            console.log(`===============================================`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
