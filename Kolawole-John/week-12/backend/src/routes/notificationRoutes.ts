import { Router } from 'express';
import {
  createNotification,
  getNotificationStatus,
  getAllNotifications,
  getSystemStats,
  getMetrics,
  getHealthCheck
} from '../controllers/notificationController';
import {
  validate,
  createNotificationSchema,
  listNotificationsSchema,
  validateRecipient
} from '../middleware/validator';
import { notificationCreationLimiter, apiLimiter } from '../middleware/rateLimiter';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * @route   POST /api/notifications
 * @desc    Create a new notification
 * @access  Public (should be protected in production)
 */
router.post(
  '/',
  notificationCreationLimiter,
  validate(createNotificationSchema, 'body'),
  validateRecipient,
  asyncHandler(createNotification)
);

/**
 * @route   GET /api/notifications/:id
 * @desc    Get notification status and logs
 * @access  Public
 */
router.get(
  '/:id',
  apiLimiter,
  asyncHandler(getNotificationStatus)
);

/**
 * @route   GET /api/notifications
 * @desc    Get all notifications with pagination and filters
 * @access  Public
 */
router.get(
  '/',
  apiLimiter,
  validate(listNotificationsSchema, 'query'),
  asyncHandler(getAllNotifications)
);

/**
 * @route   GET /api/notifications/stats/system
 * @desc    Get system statistics
 * @access  Public
 */
router.get(
  '/stats/system',
  apiLimiter,
  asyncHandler(getSystemStats)
);

/**
 * @route   GET /api/metrics
 * @desc    Get Prometheus metrics
 * @access  Public
 */
router.get(
  '/metrics',
  asyncHandler(getMetrics)
);

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get(
  '/health',
  getHealthCheck
);

export default router;