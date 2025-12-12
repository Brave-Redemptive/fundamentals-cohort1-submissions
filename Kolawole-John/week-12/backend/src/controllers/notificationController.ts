import { Request, Response } from 'express';
import { notificationService } from '../services/notification/NotificationService';
import { queueService } from '../services/queue/QueueService';
import { metrics } from '../utils/metrics';
import { logger } from '../config/logger';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../utils/constants';
import { NotificationPayload } from '../types';

export const createNotification = async (req: Request, res: Response) => {
  try {
    const payload: NotificationPayload = req.body;

    const notification = await notificationService.createNotification(payload);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.NOTIFICATION_CREATED,
      data: {
        id: notification._id,
        type: notification.type,
        recipient: notification.recipient,
        status: notification.status,
        priority: notification.priority,
        createdAt: notification.createdAt
      }
    });

  } catch (error) {
    logger.error('Error in createNotification controller:', error);
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      error: {
        message: 'Failed to create notification'
      }
    });
  }
};

export const getNotificationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await notificationService.getNotificationWithLogs(id);

    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: {
          message: 'Notification not found'
        }
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        notification: {
          id: result.notification._id,
          type: result.notification.type,
          recipient: result.notification.recipient,
          subject: result.notification.subject,
          message: result.notification.message,
          status: result.notification.status,
          priority: result.notification.priority,
          retryCount: result.notification.retryCount,
          maxRetries: result.notification.maxRetries,
          sentAt: result.notification.sentAt,
          failedAt: result.notification.failedAt,
          error: result.notification.error,
          processingTimeMs: result.notification.processingTimeMs,
          createdAt: result.notification.createdAt,
          updatedAt: result.notification.updatedAt
        },
        logs: result.logs.map(log => ({
          status: log.status,
          message: log.message,
          error: log.error,
          timestamp: log.timestamp
        }))
      }
    });

  } catch (error) {
    logger.error('Error in getNotificationStatus controller:', error);
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      error: {
        message: 'Failed to fetch notification status'
      }
    });
  }
};

export const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const { page, limit, status, type, priority } = req.query;

    const result = await notificationService.getAllNotifications(
      parseInt(page as string) || 1,
      parseInt(limit as string) || 20,
      {
        status: status as any,
        type: type as any,
        priority: priority as any
      }
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        notifications: result.notifications.map(n => ({
          id: n._id,
          type: n.type,
          recipient: n.recipient,
          subject: n.subject,
          status: n.status,
          priority: n.priority,
          retryCount: n.retryCount,
          sentAt: n.sentAt,
          createdAt: n.createdAt
        })),
        pagination: result.pagination
      }
    });

  } catch (error) {
    logger.error('Error in getAllNotifications controller:', error);
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      error: {
        message: 'Failed to fetch notifications'
      }
    });
  }
};

export const getSystemStats = async (req: Request, res: Response) => {
  try {
    const stats = await notificationService.getSystemStats();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: stats
    });

  } catch (error) {
    logger.error('Error in getSystemStats controller:', error);
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      error: {
        message: 'Failed to fetch system stats'
      }
    });
  }
};

export const getMetrics = async (req: Request, res: Response) => {
  try {
    const metricsData = await metrics.getMetrics();

    res.set('Content-Type', 'text/plain');
    res.status(HTTP_STATUS.OK).send(metricsData);

  } catch (error) {
    logger.error('Error in getMetrics controller:', error);
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      error: {
        message: 'Failed to fetch metrics'
      }
    });
  }
};

export const getHealthCheck = async (req: Request, res: Response) => {
  try {
    const isQueueConnected = queueService.isConnected();

    const health = {
      status: 'healthy',
      timestamp: new Date(),
      services: {
        database: 'connected',
        queue: isQueueConnected ? 'connected' : 'disconnected'
      }
    };

    const statusCode = isQueueConnected ? HTTP_STATUS.OK : HTTP_STATUS.SERVICE_UNAVAILABLE;

    res.status(statusCode).json(health);

  } catch (error) {
    logger.error('Error in healthCheck controller:', error);
    res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({
      status: 'unhealthy',
      timestamp: new Date(),
      error: 'Service check failed'
    });
  }
};