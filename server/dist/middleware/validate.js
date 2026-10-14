"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            const parsed = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            });
            req.body = parsed.body ?? req.body;
            req.query = parsed.query ?? req.query;
            req.params = parsed.params ?? req.params;
            return next();
        }
        catch (error) {
            return next(error);
        }
    };
};
exports.validateRequest = validateRequest;
