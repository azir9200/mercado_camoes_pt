"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const storeController_js_1 = require("../controllers/storeController.js");
const router = (0, express_1.Router)();
router.get('/info', storeController_js_1.getStoreDetails);
router.post('/checkout', storeController_js_1.checkoutOrder);
router.put('/rates', storeController_js_1.updateStoreRates);
exports.default = router;
