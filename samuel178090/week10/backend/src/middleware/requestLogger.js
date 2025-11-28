import logger from '../config/logger.js';

export const requestLogger = (req, _res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.path}`);
  next();
};
