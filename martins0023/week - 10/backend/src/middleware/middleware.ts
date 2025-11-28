import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiResponse } from '../types';

// Request Logger
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

// Global Error Handler
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  // _next: NextFunction
) => {
  console.error(err);

  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const errorCode = err instanceof ApiError ? err.code : 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred';

  const response: ApiResponse = {
    success: false,
    error: message,
    code: errorCode,
    timestamp: new Date().toISOString(),
  };

  res.status(statusCode).json(response);
};