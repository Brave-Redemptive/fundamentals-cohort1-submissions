import { Request, Response, NextFunction } from 'express';
import logger from '../lib/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  res.on('finish', () => {
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
  });
  next();
};