import { Request, Response, NextFunction } from 'express';
import { verifyAdminToken } from '../controllers/authController.js';
import { sendError } from '../utils/response.js';

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.get('authorization');
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : '';

  if (!token || !verifyAdminToken(token)) {
    return sendError(res, 'Admin authentication required.', 401);
  }

  return next();
};