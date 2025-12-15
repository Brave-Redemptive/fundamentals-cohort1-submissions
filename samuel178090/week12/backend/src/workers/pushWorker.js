/**
 * Push Worker Process - Samuel Ajewole
 * Software Engineering Week 12 Challenge
 */

require('dotenv').config();
const mongoose = require('mongoose');
const queueService = require('../services/queueService');
const notificationService = require('../services/notificationService');
const logger = require('../utils/logger');

class PushWorker {
  constructor() {
    this.isRunning = false;
    this.processedCount = 0;
    this.errorCount = 0;
  }

  async start() {
    try {
      // Connect to MongoDB
      if (process.env.DEMO_MODE !== 'true') {
        await mongoose.connect(process.env.MONGODB_URI);
        logger.info('Push Worker connected to MongoDB');
      }

      // Connect to RabbitMQ
      await queueService.connect();
      logger.info('Push Worker connected to RabbitMQ');

      this.isRunning = true;
      
      // Start consuming push jobs
      await this.startConsuming();
      
      logger.info('Push Worker started successfully');
      
      // Graceful shutdown
      process.on('SIGINT', () => this.stop());
      process.on('SIGTERM', () => this.stop());
      
    } catch (error) {
      logger.error('Push Worker startup failed:', error);
      process.exit(1);
    }
  }

  async startConsuming() {
    const queueName = 'low_priority_notifications'; // Process low priority push
    
    await queueService.consumeQueue(queueName, (job) => this.processPushJob(job));
    logger.info(`Push Worker consuming from ${queueName}`);
  }

  async processPushJob(job) {
    if (job.type !== 'push') {
      logger.warn(`Push Worker received non-push job: ${job.type}`);
      return;
    }

    const startTime = Date.now();
    
    try {
      logger.info(`Processing push job ${job.jobId} to ${job.recipient}`);
      
      // Update status to processing
      await notificationService.updateJobStatus(job.jobId, 'processing', 'Push notification being processed by worker');
      
      // Simulate push sending
      await this.sendPush(job);

      // Update status to sent
      await notificationService.updateJobStatus(
        job.jobId, 
        'sent', 
        'Push notification sent successfully',
        { 
          provider: 'mock-push',
          processingTime: Date.now() - startTime,
          worker: 'push-worker-1'
        }
      );

      // Simulate delivery confirmation (async)
      setTimeout(async () => {
        if (Math.random() < 0.99) { // 99% delivery rate for push
          await notificationService.updateJobStatus(
            job.jobId, 
            'delivered', 
            'Push notification delivered successfully'
          );
        }
      }, Math.random() * 2000 + 500); // 0.5-2.5 seconds delay

      this.processedCount++;
      logger.info(`Push job ${job.jobId} completed in ${Date.now() - startTime}ms`);
      
    } catch (error) {
      this.errorCount++;
      logger.error(`Push job ${job.jobId} failed:`, error);
      
      // Handle job failure with retry logic
      await notificationService.handleJobFailure(job.jobId, error.message);
    }
  }

  async sendPush(job) {
    // Simulate push provider API call
    const delay = Math.random() * 300 + 100; // 100-400ms delay
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Simulate 99% success rate
    if (Math.random() < 0.99) {
      logger.info(`Mock push sent to ${job.recipient}: ${job.message.substring(0, 50)}...`);
      return { success: true, messageId: `push_${Date.now()}` };
    } else {
      throw new Error('Push notification service unavailable');
    }
  }

  async stop() {
    logger.info('Stopping Push Worker...');
    this.isRunning = false;
    
    await queueService.close();
    if (process.env.DEMO_MODE !== 'true') {
      await mongoose.connection.close();
    }
    
    logger.info(`Push Worker stopped. Processed: ${this.processedCount}, Errors: ${this.errorCount}`);
    process.exit(0);
  }

  getStats() {
    return {
      type: 'push',
      isRunning: this.isRunning,
      processedCount: this.processedCount,
      errorCount: this.errorCount,
      uptime: process.uptime()
    };
  }
}

// Start worker if this file is run directly
if (require.main === module) {
  const worker = new PushWorker();
  worker.start().catch(error => {
    logger.error('Push Worker failed to start:', error);
    process.exit(1);
  });
}

module.exports = PushWorker;