import { Request, Response, NextFunction } from 'express';
import { httpRequestDurationMicroseconds } from '../lib/metrics';

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const start = process.hrtime();

  res.on('finish', () => {
    const duration = process.hrtime(start);
    const durationInSeconds = duration[0] + duration[1] / 1e9;

    httpRequestDurationMicroseconds
      .labels(req.method, req.route ? req.route.path : req.path, res.statusCode.toString())
      .observe(durationInSeconds);
  });

  next();
};