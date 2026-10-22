"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = void 0;
const authController_js_1 = require("../controllers/authController.js");
const response_js_1 = require("../utils/response.js");
const requireAdmin = (req, res, next) => {
    const authorization = req.get('authorization');
    const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : '';
    if (!token || !(0, authController_js_1.verifyAdminToken)(token)) {
        return (0, response_js_1.sendError)(res, 'Admin authentication required.', 401);
    }
    return next();
};
exports.requireAdmin = requireAdmin;
