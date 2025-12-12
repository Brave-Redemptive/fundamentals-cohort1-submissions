import { Channel } from 'amqplib';
import { rabbitMQ } from '../../config/rabbitmq';
import { logger } from '../../config/logger';
import { QueueMessage, Priority } from '../../types';
import { QUEUE_NAMES } from '../../utils/constants';
import { metrics } from '../../utils/metrics';

export class QueueService {
  private channel: Channel | null = null;

  async initialize(): Promise<void> {
    try {
      await rabbitMQ.connect();
      this.channel = rabbitMQ.getChannel();
      logger.info('QueueService initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize QueueService:', error);
      throw error;
    }
  }

  async publishToQueue(message: QueueMessage): Promise<boolean> {
    try {
      if (!this.channel) {
        throw new Error('Queue channel not initialized');
      }

      const queueName = this.selectQueue(message.priority);
      const messageBuffer = Buffer.from(JSON.stringify(message));

      const options = {
        persistent: true,
        priority: this.getPriorityLevel(message.priority),
        messageId: message.jobId,
        timestamp: Date.now(),
        contentType: 'application/json'
      };

      const published = this.channel.sendToQueue(queueName, messageBuffer, options);

      if (published) {
        logger.debug('Message published to queue', {
          jobId: message.jobId,
          queue: queueName,
          priority: message.priority
        });

        // Update metrics
        await this.updateQueueMetrics(queueName);
        
        return true;
      } else {
        logger.warn('Queue buffer full, message not published', {
          jobId: message.jobId
        });
        return false;
      }

    } catch (error) {
      logger.error('Failed to publish message to queue:', error);
      throw error;
    }
  }

  async publishToRetryQueue(message: QueueMessage): Promise<boolean> {
    try {
      if (!this.channel) {
        throw new Error('Queue channel not initialized');
      }

      const messageBuffer = Buffer.from(JSON.stringify(message));

      const published = this.channel.sendToQueue(
        QUEUE_NAMES.RETRY,
        messageBuffer,
        {
          persistent: true,
          messageId: message.jobId
        }
      );

      if (published) {
        logger.info('Message published to retry queue', {
          jobId: message.jobId,
          retryCount: message.retryCount
        });

        metrics.incrementRetried(message.type);
        return true;
      }

      return false;

    } catch (error) {
      logger.error('Failed to publish to retry queue:', error);
      throw error;
    }
  }

  async publishToDLQ(message: QueueMessage, error: string): Promise<boolean> {
    try {
      if (!this.channel) {
        throw new Error('Queue channel not initialized');
      }

      const dlqMessage = {
        ...message,
        error,
        failedAt: new Date(),
        finalRetryCount: message.retryCount
      };

      const messageBuffer = Buffer.from(JSON.stringify(dlqMessage));

      const published = this.channel.sendToQueue(
        QUEUE_NAMES.DLQ,
        messageBuffer,
        {
          persistent: true,
          messageId: message.jobId
        }
      );

      if (published) {
        logger.warn('Message sent to Dead Letter Queue', {
          jobId: message.jobId,
          error,
          retryCount: message.retryCount
        });

        return true;
      }

      return false;

    } catch (error) {
      logger.error('Failed to publish to DLQ:', error);
      throw error;
    }
  }

  private selectQueue(priority: Priority): string {
    // Route high priority and critical notifications to dedicated queue
    if (priority === Priority.HIGH || priority === Priority.CRITICAL) {
      return QUEUE_NAMES.HIGH_PRIORITY;
    }
    return QUEUE_NAMES.NOTIFICATIONS;
  }

  private getPriorityLevel(priority: Priority): number {
    const priorityMap = {
      [Priority.LOW]: 1,
      [Priority.MEDIUM]: 5,
      [Priority.HIGH]: 8,
      [Priority.CRITICAL]: 10
    };
    return priorityMap[priority] || 5;
  }

  private async updateQueueMetrics(queueName: string): Promise<void> {
    try {
      if (!this.channel) return;

      const queueInfo = await this.channel.checkQueue(queueName);
      metrics.setQueueDepth(queueName, queueInfo.messageCount);

    } catch (error) {
      // Non-critical error, just log it
      logger.debug('Failed to update queue metrics:', error);
    }
  }

  async getQueueStats(): Promise<Record<string, number>> {
    try {
      if (!this.channel) {
        throw new Error('Queue channel not initialized');
      }

      const stats: Record<string, number> = {};

      const queues = [
        QUEUE_NAMES.NOTIFICATIONS,
        QUEUE_NAMES.HIGH_PRIORITY,
        QUEUE_NAMES.RETRY,
        QUEUE_NAMES.DLQ
      ];

      for (const queueName of queues) {
        const queueInfo = await this.channel.checkQueue(queueName);
        stats[queueName] = queueInfo.messageCount;
      }

      return stats;

    } catch (error) {
      logger.error('Failed to get queue stats:', error);
      return {};
    }
  }

  async purgeQueue(queueName: string): Promise<void> {
    try {
      if (!this.channel) {
        throw new Error('Queue channel not initialized');
      }

      await this.channel.purgeQueue(queueName);
      logger.info(`Queue ${queueName} purged successfully`);

    } catch (error) {
      logger.error(`Failed to purge queue ${queueName}:`, error);
      throw error;
    }
  }

  async close(): Promise<void> {
    try {
      await rabbitMQ.close();
      this.channel = null;
      logger.info('QueueService closed');
    } catch (error) {
      logger.error('Error closing QueueService:', error);
      throw error;
    }
  }

  isConnected(): boolean {
    return rabbitMQ.isConnected();
  }
}

export const queueService = new QueueService();