import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';

// Authorized Admin Credentials specified by store owner
const AUTHORIZED_ADMIN_PHONES = [
  '+351 920 319 177',
  '+351920319177',
  '351920319177',
  '920319177',
  'admin'
];
const AUTHORIZED_ADMIN_PASSWORD = 'admin@12345';

// Simple token generator for session persistence
export const generateAdminToken = (phone: string): string => {
  const payload = {
    phone,
    role: 'SUPER_ADMIN',
    issuedAt: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

export const verifyAdminToken = (token: string): boolean => {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    if (!decoded || decoded.role !== 'SUPER_ADMIN') return false;
    if (decoded.expiresAt && decoded.expiresAt < Date.now()) return false;
    return true;
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

    const cleanInput = String(identifier).trim().toLowerCase();
    const isPhoneValid = AUTHORIZED_ADMIN_PHONES.some(p => p.toLowerCase() === cleanInput || cleanInput.replace(/\s+/g, '') === p.replace(/\s+/g, ''));
    const isPasswordValid = String(password).trim() === AUTHORIZED_ADMIN_PASSWORD;

    if (!isPhoneValid || !isPasswordValid) {
      return sendError(res, 'Credenciais inválidas. Acesso restrito exclusivamente ao administrador (+351 920 319 177).', 401);
    }

    const token = generateAdminToken('+351 920 319 177');

    return sendSuccess(res, {
      token,
      admin: {
        name: 'Administrador Mercado Camões',
        phone: '+351 920 319 177',
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
        name: 'Administrador Mercado Camões',
        phone: '+351 920 319 177',
        role: 'SUPER_ADMIN'
      }
    }, 'Sessão válida.');
  } catch (error: any) {
    return sendError(res, error.message || 'Erro ao verificar sessão', 500);
  }
};
