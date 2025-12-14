import { ConsumeMessage } from 'amqplib';
import { connectDB } from '../config/database';
import { rabbitMQ } from '../config/rabbitmq';
import { logger } from '../config/logger';
import { notificationService } from '../services/notification/NotificationService';
import { queueService } from '../services/queue/QueueService';
import { metrics } from '../utils/metrics';
import { QUEUE_NAMES, WORKER_CONFIG } from '../utils/constants';
import { QueueMessage } from '../types';

class NotificationWorker {
  private isShuttingDown = false;
  private activeProcessing = 0;

  async start(): Promise<void> {
    try {
      logger.info('Starting Notification Worker...');

      // Connect to database
      await connectDB();

      // Initialize queue service
      await queueService.initialize();

      // Setup graceful shutdown
      this.setupGracefulShutdown();

      // Start consuming from queues
      await this.consumeFromQueue(QUEUE_NAMES.HIGH_PRIORITY);
      await this.consumeFromQueue(QUEUE_NAMES.NOTIFICATIONS);
      await this.consumeFromQueue(QUEUE_NAMES.RETRY);

      // Update metrics
      metrics.setActiveWorkers(1);

      logger.info('Notification Worker started successfully');

    } catch (error) {
      logger.error('Failed to start Notification Worker:', error);
      process.exit(1);
    }
  }

  private async consumeFromQueue(queueName: string): Promise<void> {
    try {
      const channel = rabbitMQ.getChannel();

      await channel.consume(
        queueName,
        async (msg: ConsumeMessage | null) => {
          if (!msg) {
            logger.warn('Received null message from queue');
            return;
          }

          // Check if shutting down
          if (this.isShuttingDown) {
            logger.info('Worker shutting down, rejecting message');
            channel.nack(msg, false, true); // Requeue the message
            return;
          }

          this.activeProcessing++;

          try {
            await this.processMessage(msg, channel);
          } catch (error) {
            logger.error('Error processing message:', error);
            // Requeue with delay
            channel.nack(msg, false, true);
          } finally {
            this.activeProcessing--;
          }
        },
        {
          consumerTag: `${WORKER_CONFIG.CONSUMER_TAG}-${queueName}`,
          noAck: false
        }
      );

      logger.info(`Worker consuming from queue: ${queueName}`);

    } catch (error) {
      logger.error(`Failed to consume from queue ${queueName}:`, error);
      throw error;
    }
  }

  private async processMessage(
    msg: ConsumeMessage,
    channel: any
  ): Promise<void> {
    const queueStartTime = Date.now();
    
    try {
      // Parse message
      const queueMessage: QueueMessage = JSON.parse(msg.content.toString());

      logger.info('Processing message', {
        jobId: queueMessage.jobId,
        type: queueMessage.type,
        retryCount: queueMessage.retryCount
      });

      // Calculate queue wait time
      const messageTimestamp = msg.properties.timestamp || Date.now();
      const queueWaitTime = (Date.now() - messageTimestamp) / 1000;
      metrics.recordQueueWaitTime(
        msg.fields.routingKey,
        queueWaitTime
      );

      // Process the notification
      const success = await notificationService.processNotification(queueMessage.jobId);

      if (success) {
        // Acknowledge message
        channel.ack(msg);
        logger.info('Message processed successfully', {
          jobId: queueMessage.jobId,
          processingTime: Date.now() - queueStartTime
        });
      } else {
        // Message failed but will be retried - still acknowledge to prevent redelivery
        channel.ack(msg);
        logger.warn('Message processing failed, scheduled for retry', {
          jobId: queueMessage.jobId
        });
      }

    } catch (error) {
      logger.error('Error processing message:', {
        error,
        messageId: msg.properties.messageId
      });

      // Reject and requeue
      channel.nack(msg, false, true);
    }
  }

  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      if (this.isShuttingDown) {
        logger.warn('Shutdown already in progress');
        return;
      }

      logger.info(`${signal} received. Starting graceful shutdown...`);
      this.isShuttingDown = true;

      // Wait for active processing to complete
      const maxWaitTime = 30000; // 30 seconds
      const startTime = Date.now();

      while (this.activeProcessing > 0 && Date.now() - startTime < maxWaitTime) {
        logger.info(`Waiting for ${this.activeProcessing} active jobs to complete...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (this.activeProcessing > 0) {
        logger.warn(`Forcing shutdown with ${this.activeProcessing} active jobs`);
      }

      try {
        // Close queue connection
        await queueService.close();
        logger.info('Queue connection closed');

        // Close database connection
        const mongoose = require('mongoose');
        await mongoose.connection.close();
        logger.info('Database connection closed');

        // Update metrics
        metrics.setActiveWorkers(0);

        logger.info('Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        logger.error('Error during shutdown:', error);
        process.exit(1);
      }
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      shutdown('UNCAUGHT_EXCEPTION');
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection:', { reason, promise });
      shutdown('UNHANDLED_REJECTION');
    });
  }
}

// Start the worker
const worker = new NotificationWorker();
worker.start();