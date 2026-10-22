import { createHmac, timingSafeEqual } from 'node:crypto';
import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';

const ADMIN_PHONE = process.env.ADMIN_LOGIN_ID || '+351 920 319 177';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET;

export const generateAdminToken = (phone: string): string => {
  const payload = {
    phone,
    role: 'SUPER_ADMIN',
    issuedAt: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
  };
  if (!ADMIN_TOKEN_SECRET) throw new Error('ADMIN_TOKEN_SECRET is not configured');
  const signature = createHmac('sha256', ADMIN_TOKEN_SECRET).update(JSON.stringify(payload)).digest('hex');
  return Buffer.from(JSON.stringify({ ...payload, signature })).toString('base64');
};

export const verifyAdminToken = (token: string): boolean => {
  try {
    if (!ADMIN_TOKEN_SECRET) return false;
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    const payload = {
      phone: decoded.phone,
      role: decoded.role,
      issuedAt: decoded.issuedAt,
      expiresAt: decoded.expiresAt
    };
    if (payload.role !== 'SUPER_ADMIN' || typeof payload.expiresAt !== 'number' || payload.expiresAt <= Date.now()) return false;

    const expected = createHmac('sha256', ADMIN_TOKEN_SECRET).update(JSON.stringify(payload)).digest();
    const received = Buffer.from(String(decoded.signature || ''), 'hex');
    return received.length === expected.length && timingSafeEqual(received, expected);
  } catch {
    return false;
  }
};

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return sendError(res, 'Número de telefone e palavra-passe são obrigatórios.', 400);
    }
    if (!ADMIN_PASSWORD || !ADMIN_TOKEN_SECRET) {
      return sendError(res, 'Admin authentication is not configured.', 503);
    }

    const cleanInput = String(identifier).trim().toLowerCase();
    const isPhoneValid = cleanInput === ADMIN_PHONE.toLowerCase() || cleanInput.replace(/\s+/g, '') === ADMIN_PHONE.replace(/\s+/g, '');
    const isPasswordValid = String(password) === ADMIN_PASSWORD;

    if (!isPhoneValid || !isPasswordValid) {
      return sendError(res, 'Credenciais inválidas. Acesso restrito exclusivamente ao administrador (+351 920 319 177).', 401);
    }

    const token = generateAdminToken(ADMIN_PHONE);

    return sendSuccess(res, {
      token,
      admin: {
        name: 'Administrador Mercado De Camões',
        phone: ADMIN_PHONE,
        role: 'SUPER_ADMIN',
        authenticatedAt: new Date().toISOString()
      }
    }, 'Autenticação bem-sucedida como Administrador.');
  } catch (error: any) {
    return sendError(res, error.message || 'Falha ao autenticar administrador', 500);
  }
};

export const verifySession = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Sessão não autorizada.', 401);
    }

    const token = authHeader.split(' ')[1];
    const isValid = verifyAdminToken(token);

    if (!isValid) {
      return sendError(res, 'Sessão expirada ou inválida. Por favor volte a iniciar sessão.', 401);
    }

    return sendSuccess(res, {
      valid: true,
      admin: {
        name: 'Administrador Mercado De Camões',
        phone: ADMIN_PHONE,
        role: 'SUPER_ADMIN'
      }
    }, 'Sessão válida.');
  } catch (error: any) {
    return sendError(res, error.message || 'Erro ao verificar sessão', 500);
  }
};
