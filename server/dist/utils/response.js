"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, data, message, statusCode = 200, meta) => {
    const body = {
        success: true,
        data,
        ...(message && { message }),
        ...(meta && { meta })
    };
    return res.status(statusCode).json(body);
};
exports.sendSuccess = sendSuccess;
const sendError = (res, error, statusCode = 400, details) => {
    const body = {
        success: false,
        error,
        ...(details && { meta: { details } })
    };
    return res.status(statusCode).json(body);
};
exports.sendError = sendError;
