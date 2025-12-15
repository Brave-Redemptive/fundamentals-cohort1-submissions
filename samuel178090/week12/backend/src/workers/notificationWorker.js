/**
 * Notification Worker - Samuel Ajewole
 * Software Engineering Week 12 Challenge
 */

require('dotenv').config();
const mongoose = require('mongoose');
const queueService = require('../services/queueService');
const notificationService = require('../services/notificationService');
const logger = require('../utils/logger');

// Mock notification providers
const mockProviders = {
  email: {
    async send(recipient, subject, message, metadata) {
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, parseInt(process.env.EMAIL_PROVIDER_DELAY) || 1000));
      
      // Simulate 95% success rate
      if (Math.random() < 0.95) {
        logger.info(`Email sent to ${recipient}: ${subject}`);
        return { success: true, messageId: `email_${Date.now()}` };
      } else {
        throw new Error('Email provider temporarily unavailable');
      }
    }
  },

  sms: {
    async send(recipient, message, metadata) {
      // Simulate SMS sending delay
      await new Promise(resolve => setTimeout(resolve, parseInt(process.env.SMS_PROVIDER_DELAY) || 500));
      
      // Simulate 98% success rate
      if (Math.random() < 0.98) {
        logger.info(`SMS sent to ${recipient}: ${message.substring(0, 50)}...`);
        return { success: true, messageId: `sms_${Date.now()}` };
      } else {
        throw new Error('SMS provider rate limit exceeded');
      }
    }
  },

  push: {
    async send(recipient, message, metadata) {
      // Simulate push notification delay
      await new Promise(resolve => setTimeout(resolve, parseInt(process.env.PUSH_PROVIDER_DELAY) || 300));
      
      // Simulate 99% success rate
      if (Math.random() < 0.99) {
        logger.info(`Push notification sent to ${recipient}: ${message.substring(0, 50)}...`);
        return { success: true, messageId: `push_${Date.now()}` };
      } else {
        throw new Error('Push notification service unavailable');
      }
    }
  }
};

class NotificationWorker {
  constructor() {
    this.isRunning = false;
    this.processedCount = 0;
    this.errorCount = 0;
  }

  async start() {
    try {
      // Connect to MongoDB
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      logger.info('Worker connected to MongoDB');

      // Connect to RabbitMQ
      await queueService.connect();
      logger.info('Worker connected to RabbitMQ');

      this.isRunning = true;
      
      // Start consuming from all priority queues
      await this.startConsumers();
      
      logger.info('Samuel\'s Notification Worker started successfully');
      
      // Graceful shutdown
      process.on('SIGINT', () => this.stop());
      process.on('SIGTERM', () => this.stop());
      
    } catch (error) {
      logger.error('Worker startup failed:', error);
      process.exit(1);
    }
  }

  async startConsumers() {
    const queues = ['high_priority_notifications', 'medium_priority_notifications', 'low_priority_notifications'];
    
    for (const queueName of queues) {
      await queueService.consumeQueue(queueName, (job) => this.processJob(job));
      logger.info(`Started consuming from ${queueName}`);
    }
  }

  async processJob(job) {
    const startTime = Date.now();
    
    try {
      logger.info(`Processing job ${job.jobId} (${job.type})`);
      
      // Update status to processing
      await notificationService.updateJobStatus(job.jobId, 'processing', 'Job is being processed');
      
      // Get the appropriate provider
      const provider = mockProviders[job.type];
      if (!provider) {
        throw new Error(`Unsupported notification type: ${job.type}`);
      }

      // Send notification
      let result;
      if (job.type === 'email') {
        result = await provider.send(job.recipient, job.subject, job.message, job.metadata);
      } else {
        result = await provider.send(job.recipient, job.message, job.metadata);
      }

      // Update status to sent
      await notificationService.updateJobStatus(
        job.jobId, 
        'sent', 
        'Notification sent successfully',
        { 
          messageId: result.messageId,
          processingTime: Date.now() - startTime
        }
      );

      // Simulate delivery confirmation (async)
      setTimeout(async () => {
        if (Math.random() < 0.9) { // 90% delivery rate
          await notificationService.updateJobStatus(
            job.jobId, 
            'delivered', 
            'Notification delivered successfully'
          );
        }
      }, 2000);

      this.processedCount++;
      logger.info(`Job ${job.jobId} completed successfully in ${Date.now() - startTime}ms`);
      
    } catch (error) {
      this.errorCount++;
      logger.error(`Job ${job.jobId} failed:`, error);
      
      // Handle job failure with retry logic
      await notificationService.handleJobFailure(job.jobId, error.message);
    }
  }

  async stop() {
    logger.info('Stopping notification worker...');
    this.isRunning = false;
    
    await queueService.close();
    await mongoose.connection.close();
    
    logger.info(`Worker stopped. Processed: ${this.processedCount}, Errors: ${this.errorCount}`);
    process.exit(0);
  }

  getStats() {
    return {
      isRunning: this.isRunning,
      processedCount: this.processedCount,
      errorCount: this.errorCount,
      uptime: process.uptime()
    };
  }
}

// Start worker if this file is run directly
if (require.main === module) {
  const worker = new NotificationWorker();
  worker.start().catch(error => {
    logger.error('Worker failed to start:', error);
    process.exit(1);
  });
}

module.exports = NotificationWorker;