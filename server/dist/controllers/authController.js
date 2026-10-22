"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySession = exports.adminLogin = exports.verifyAdminToken = exports.generateAdminToken = void 0;
const node_crypto_1 = require("node:crypto");
const response_js_1 = require("../utils/response.js");
const ADMIN_PHONE = process.env.ADMIN_LOGIN_ID || '+351 920 319 177';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET;
const generateAdminToken = (phone) => {
    const payload = {
        phone,
        role: 'SUPER_ADMIN',
        issuedAt: Date.now(),
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    };
    if (!ADMIN_TOKEN_SECRET)
        throw new Error('ADMIN_TOKEN_SECRET is not configured');
    const signature = (0, node_crypto_1.createHmac)('sha256', ADMIN_TOKEN_SECRET).update(JSON.stringify(payload)).digest('hex');
    return Buffer.from(JSON.stringify({ ...payload, signature })).toString('base64');
};
exports.generateAdminToken = generateAdminToken;
const verifyAdminToken = (token) => {
    try {
        if (!ADMIN_TOKEN_SECRET)
            return false;
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
        const payload = {
            phone: decoded.phone,
            role: decoded.role,
            issuedAt: decoded.issuedAt,
            expiresAt: decoded.expiresAt
        };
        if (payload.role !== 'SUPER_ADMIN' || typeof payload.expiresAt !== 'number' || payload.expiresAt <= Date.now())
            return false;
        const expected = (0, node_crypto_1.createHmac)('sha256', ADMIN_TOKEN_SECRET).update(JSON.stringify(payload)).digest();
        const received = Buffer.from(String(decoded.signature || ''), 'hex');
        return received.length === expected.length && (0, node_crypto_1.timingSafeEqual)(received, expected);
    }
    catch {
        return false;
    }
};
exports.verifyAdminToken = verifyAdminToken;
const adminLogin = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        if (!identifier || !password) {
            return (0, response_js_1.sendError)(res, 'Número de telefone e palavra-passe são obrigatórios.', 400);
        }
        if (!ADMIN_PASSWORD || !ADMIN_TOKEN_SECRET) {
            return (0, response_js_1.sendError)(res, 'Admin authentication is not configured.', 503);
        }
        const cleanInput = String(identifier).trim().toLowerCase();
        const isPhoneValid = cleanInput === ADMIN_PHONE.toLowerCase() || cleanInput.replace(/\s+/g, '') === ADMIN_PHONE.replace(/\s+/g, '');
        const isPasswordValid = String(password) === ADMIN_PASSWORD;
        if (!isPhoneValid || !isPasswordValid) {
            return (0, response_js_1.sendError)(res, 'Credenciais inválidas. Acesso restrito exclusivamente ao administrador (+351 920 319 177).', 401);
        }
        const token = (0, exports.generateAdminToken)(ADMIN_PHONE);
        return (0, response_js_1.sendSuccess)(res, {
            token,
            admin: {
                name: 'Administrador Mercado De Camões',
                phone: ADMIN_PHONE,
                role: 'SUPER_ADMIN',
                authenticatedAt: new Date().toISOString()
            }
        }, 'Autenticação bem-sucedida como Administrador.');
    }
    catch (error) {
        return (0, response_js_1.sendError)(res, error.message || 'Falha ao autenticar administrador', 500);
    }
};
exports.adminLogin = adminLogin;
const verifySession = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return (0, response_js_1.sendError)(res, 'Sessão não autorizada.', 401);
        }
        const token = authHeader.split(' ')[1];
        const isValid = (0, exports.verifyAdminToken)(token);
        if (!isValid) {
            return (0, response_js_1.sendError)(res, 'Sessão expirada ou inválida. Por favor volte a iniciar sessão.', 401);
        }
        return (0, response_js_1.sendSuccess)(res, {
            valid: true,
            admin: {
                name: 'Administrador Mercado De Camões',
                phone: ADMIN_PHONE,
                role: 'SUPER_ADMIN'
            }
        }, 'Sessão válida.');
    }
    catch (error) {
        return (0, response_js_1.sendError)(res, error.message || 'Erro ao verificar sessão', 500);
    }
};
exports.verifySession = verifySession;
