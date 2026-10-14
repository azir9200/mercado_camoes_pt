"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutOrder = exports.getStoreDetails = void 0;
const storeService_js_1 = require("../services/storeService.js");
const response_js_1 = require("../utils/response.js");
const getStoreDetails = (req, res) => {
    try {
        const info = storeService_js_1.storeService.getStoreInfo();
        return (0, response_js_1.sendSuccess)(res, info, 'Store information retrieved successfully');
    }
    catch (error) {
        return (0, response_js_1.sendError)(res, error.message || 'Failed to retrieve store info', 500);
    }
};
exports.getStoreDetails = getStoreDetails;
const checkoutOrder = (req, res) => {
    try {
        const { customerName, customerPhone, deliveryOption, notes, items } = req.body;
        if (!items || !Array.isArray(items) || items.length === 0) {
            return (0, response_js_1.sendError)(res, 'Cart is empty. Please add items to checkout.', 400);
        }
        const result = storeService_js_1.storeService.processOrderCheckout({
            customerName: customerName || 'Guest Customer',
            customerPhone: customerPhone || '',
            deliveryOption: deliveryOption || 'pickup',
            notes,
            items
        });
        return (0, response_js_1.sendSuccess)(res, result, 'Order checkout processed', 200);
    }
    catch (error) {
        return (0, response_js_1.sendError)(res, error.message || 'Failed to process order', 400);
    }
};
exports.checkoutOrder = checkoutOrder;
