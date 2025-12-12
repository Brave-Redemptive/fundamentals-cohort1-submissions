import rateLimit from 'express-rate-limit';
import { logger } from '../config/logger';
import { RATE_LIMITS, ERROR_MESSAGES, HTTP_STATUS } from '../utils/constants';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: RATE_LIMITS.WINDOW_MS,
  max: RATE_LIMITS.MAX_REQUESTS,
  message: {
    success: false,
    error: {
      message: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
      retryAfter: Math.ceil(RATE_LIMITS.WINDOW_MS / 1000)
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path
    });

    res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({
      success: false,
      error: {
        message: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
        retryAfter: Math.ceil(RATE_LIMITS.WINDOW_MS / 1000)
      }
    });
  }
});

// Stricter rate limiter for notification creation
export const notificationCreationLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 50, // 50 notifications per minute
  message: {
    success: false,
    error: {
      message: 'Too many notification requests. Please try again later.',
      retryAfter: 60
    }
  },
  skipSuccessfulRequests: false,
  handler: (req, res) => {
    logger.warn('Notification creation rate limit exceeded', {
      ip: req.ip,
      path: req.path
    });

    res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({
      success: false,
      error: {
        message: 'Too many notification requests. Please try again later.',
        retryAfter: 60
      }
    });
  }
});

// Burst protection for high-volume endpoints
export const burstLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 10, // 10 requests per second
  skipSuccessfulRequests: true
});