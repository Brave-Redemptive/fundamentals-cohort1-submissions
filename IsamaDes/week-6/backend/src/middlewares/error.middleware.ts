//logs critical error details with context,
//improve user experience by improving debugging,
//ensures consistent and maintainable error responses across the app
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import type { HttpError } from "../types/httpError.js";


export const errorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
  logger.error({ err, url: req.url }, 'Unhandled error');
  const status = err.status ?? 500;
  res.status(status).json({ 
    success: false,
    message: err.message || "Internal Server Error",
})
};
