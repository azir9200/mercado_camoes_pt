"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeService = exports.StoreService = void 0;
const index_js_1 = require("../config/index.js");
const whatsapp_js_1 = require("../utils/whatsapp.js");
class StoreService {
    getStoreInfo() {
        return {
            name: index_js_1.config.store.name,
            address: index_js_1.config.store.address,
            phone: index_js_1.config.store.phone,
            whatsapp: index_js_1.config.store.whatsapp,
            email: index_js_1.config.store.email,
            openingHours: index_js_1.config.store.openingHours,
            geo: index_js_1.config.store.geo,
            luggageRates: index_js_1.config.store.luggageRates
        };
    }
    processOrderCheckout(order) {
        const total = order.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
        const whatsappUrl = (0, whatsapp_js_1.formatOrderWhatsAppMessage)(order);
        return {
            success: true,
            whatsappUrl,
            total: Number(total.toFixed(2))
        };
    }
}
exports.StoreService = StoreService;
exports.storeService = new StoreService();
