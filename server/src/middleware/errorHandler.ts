import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { sendError } from '../utils/response.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Unhandled API Error:', err);

  if (err instanceof ZodError) {
    return sendError(
      res,
      'Validation Error',
      422,
      err.errors.map(e => ({ path: e.path.join('.'), message: e.message }))
    );
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return sendError(res, message, statusCode);
};

export const notFoundHandler = (req: Request, res: Response) => {
  return sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};
