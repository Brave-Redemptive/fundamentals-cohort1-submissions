import { Notification, INotification } from '../../models/Notification';
import { NotificationLog } from '../../models/NotificationLog';
import { EmailProvider } from '../provider/EmailProvider';
import { SMSProvider } from '../provider/SMSProvider';
import { PushProvider } from '../provider/PushProvider';
import { queueService } from '../queue/QueueService';
import { retryService } from '../retry/RetryService';
import { logger } from '../../config/logger';
import { metrics } from '../../utils/metrics';
import {
  NotificationPayload,
  NotificationType,
  NotificationStatus,
  Priority,
  QueueMessage,
  ProviderResponse
} from '../../types';
import { RETRY_CONFIG } from '../../utils/constants';

export class NotificationService {
  private emailProvider: EmailProvider;
  private smsProvider: SMSProvider;
  private pushProvider: PushProvider;

  constructor() {
    this.emailProvider = new EmailProvider();
    this.smsProvider = new SMSProvider();
    this.pushProvider = new PushProvider();
  }

  async createNotification(payload: NotificationPayload): Promise<INotification> {
    try {
      // Create notification record
      const notification = await Notification.create({
        type: payload.type,
        recipient: payload.recipient,
        subject: payload.subject,
        message: payload.message,
        status: NotificationStatus.PENDING,
        priority: payload.priority || Priority.MEDIUM,
        retryCount: 0,
        maxRetries: RETRY_CONFIG.MAX_ATTEMPTS,
        metadata: payload.metadata,
        scheduledAt: payload.scheduledAt
      });

      // Log creation
      await NotificationLog.create({
        notificationId: notification._id,
        status: NotificationStatus.PENDING,
        message: 'Notification created',
        timestamp: new Date()
      });

      // Update metrics
      metrics.incrementCreated(payload.type);

      logger.info('Notification created', {
        id: notification._id,
        type: notification.type,
        priority: notification.priority
      });

      // Queue the notification
      await this.queueNotification(notification);

      return notification;

    } catch (error) {
      logger.error('Failed to create notification:', error);
      throw error;
    }
  }

  async queueNotification(notification: INotification): Promise<void> {
    try {
      const queueMessage: QueueMessage = {
        jobId: notification._id.toString(),
        type: notification.type,
        recipient: notification.recipient,
        subject: notification.subject,
        message: notification.message,
        priority: notification.priority,
        retryCount: notification.retryCount,
        metadata: notification.metadata
      };

      const queued = await queueService.publishToQueue(queueMessage);

      if (queued) {
        notification.status = NotificationStatus.QUEUED;
        await notification.save();

        await NotificationLog.create({
          notificationId: notification._id,
          status: NotificationStatus.QUEUED,
          message: 'Notification queued for processing',
          timestamp: new Date()
        });

        logger.info('Notification queued', {
          id: notification._id,
          priority: notification.priority
        });
      } else {
        throw new Error('Failed to queue notification');
      }

    } catch (error) {
      logger.error('Failed to queue notification:', error);
      
      notification.status = NotificationStatus.FAILED;
      notification.error = 'Queue unavailable';
      await notification.save();

      throw error;
    }
  }

  async processNotification(jobId: string): Promise<boolean> {
    const startTime = Date.now();
    let notification: INotification | null = null;

    try {
      notification = await Notification.findById(jobId);

      if (!notification) {
        logger.error('Notification not found', { jobId });
        return false;
      }

      // Update status to processing
      notification.status = NotificationStatus.PROCESSING;
      await notification.save();

      await NotificationLog.create({
        notificationId: notification._id,
        status: NotificationStatus.PROCESSING,
        message: 'Processing notification',
        timestamp: new Date()
      });

      // Send notification through appropriate provider
      const result = await this.sendThroughProvider(notification);

      if (result.success) {
        // Success
        notification.status = NotificationStatus.SENT;
        notification.sentAt = new Date();
        notification.providerMessageId = result.messageId;
        notification.processingTimeMs = Date.now() - startTime;
        await notification.save();

        await NotificationLog.create({
          notificationId: notification._id,
          status: NotificationStatus.SENT,
          message: 'Notification sent successfully',
          metadata: { messageId: result.messageId },
          timestamp: new Date()
        });

        metrics.incrementSent(notification.type);
        metrics.recordProcessingDuration(
          notification.type,
          'success',
          (Date.now() - startTime) / 1000
        );

        logger.info('Notification sent successfully', {
          id: notification._id,
          type: notification.type,
          processingTime: Date.now() - startTime
        });

        return true;

      } else {
        // Provider failure - attempt retry
        return await this.handleFailure(notification, result.error || 'Unknown error');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Error processing notification:', error);

      if (notification) {
        await this.handleFailure(notification, errorMessage);
      }

      return false;
    }
  }

  private async sendThroughProvider(notification: INotification): Promise<ProviderResponse> {
    switch (notification.type) {
      case NotificationType.EMAIL:
        return await this.emailProvider.send(
          notification.recipient,
          notification.subject || 'Notification',
          notification.message
        );

      case NotificationType.SMS:
        return await this.smsProvider.send(
          notification.recipient,
          notification.message
        );

      case NotificationType.PUSH:
        return await this.pushProvider.send(
          notification.recipient,
          notification.subject || 'Notification',
          notification.message
        );

      default:
        throw new Error(`Unsupported notification type: ${notification.type}`);
    }
  }

  private async handleFailure(notification: INotification, error: string): Promise<boolean> {
    notification.retryCount += 1;
    notification.error = error;
    notification.failedAt = new Date();

    const shouldRetry = retryService.shouldRetry(notification.retryCount);

    if (shouldRetry) {
      // Retry
      notification.status = NotificationStatus.RETRYING;
      await notification.save();

      await NotificationLog.create({
        notificationId: notification._id,
        status: NotificationStatus.RETRYING,
        message: `Retry attempt ${notification.retryCount}`,
        error,
        timestamp: new Date()
      });

      const queueMessage: QueueMessage = {
        jobId: notification._id.toString(),
        type: notification.type,
        recipient: notification.recipient,
        subject: notification.subject,
        message: notification.message,
        priority: notification.priority,
        retryCount: notification.retryCount,
        metadata: notification.metadata
      };

      await queueService.publishToRetryQueue(queueMessage);
      metrics.incrementRetried(notification.type);

      logger.warn('Notification queued for retry', {
        id: notification._id,
        retryCount: notification.retryCount,
        error
      });

      return false;

    } else {
      // Max retries exceeded - send to DLQ
      notification.status = NotificationStatus.FAILED;
      await notification.save();

      await NotificationLog.create({
        notificationId: notification._id,
        status: NotificationStatus.FAILED,
        message: 'Max retries exceeded',
        error,
        timestamp: new Date()
      });

      const queueMessage: QueueMessage = {
        jobId: notification._id.toString(),
        type: notification.type,
        recipient: notification.recipient,
        subject: notification.subject,
        message: notification.message,
        priority: notification.priority,
        retryCount: notification.retryCount,
        metadata: notification.metadata
      };

      await queueService.publishToDLQ(queueMessage, error);
      metrics.incrementFailed(notification.type, 'max_retries_exceeded');

      logger.error('Notification failed permanently', {
        id: notification._id,
        retryCount: notification.retryCount,
        error
      });

      return false;
    }
  }

  async getNotificationById(id: string): Promise<INotification | null> {
    return await Notification.findById(id);
  }

  async getNotificationWithLogs(id: string) {
    const notification = await Notification.findById(id);
    if (!notification) return null;

    const logs = await NotificationLog.find({ notificationId: id }).sort({ timestamp: 1 });

    return {
      notification,
      logs
    };
  }

  async getAllNotifications(
    page: number = 1,
    limit: number = 20,
    filters?: {
      status?: NotificationStatus;
      type?: NotificationType;
      priority?: Priority;
    }
  ) {
    const query: any = {};

    if (filters) {
      if (filters.status) query.status = filters.status;
      if (filters.type) query.type = filters.type;
      if (filters.priority) query.priority = filters.priority;
    }

    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments(query)
    ]);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getSystemStats() {
    const stats = await Notification.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgProcessingTime: { $avg: '$processingTimeMs' }
        }
      }
    ]);

    const queueStats = await queueService.getQueueStats();

    return {
      statusBreakdown: stats,
      queueDepth: queueStats,
      timestamp: new Date()
    };
  }
}

export const notificationService = new NotificationService();