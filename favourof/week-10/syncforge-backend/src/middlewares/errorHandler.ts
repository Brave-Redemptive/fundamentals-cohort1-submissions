import { Request, Response } from 'express';
import ApiError from '../utils/ApiError';

export default function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
) {
  const status = err.statusCode || 500;

  res.status(status).json({
    success: false,
    message: err.message || 'Server Error',
  });
}
