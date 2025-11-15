import { Request, Response, NextFunction } from 'express';
import logger from '../lib/logger';
import { errorCounter } from '../lib/metrics';

interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
  logger.error(err.message, { stack: err.stack });
  
  errorCounter.inc({ type: 'unhandled_exception' });

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};