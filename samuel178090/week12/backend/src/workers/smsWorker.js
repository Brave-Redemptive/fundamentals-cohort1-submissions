/**
 * SMS Worker Process - Samuel Ajewole
 * Software Engineering Week 12 Challenge
 */

require('dotenv').config();
const mongoose = require('mongoose');
const queueService = require('../services/queueService');
const notificationService = require('../services/notificationService');
const logger = require('../utils/logger');

class SMSWorker {
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
        logger.info('SMS Worker connected to MongoDB');
      }

      // Connect to RabbitMQ
      await queueService.connect();
      logger.info('SMS Worker connected to RabbitMQ');

      this.isRunning = true;
      
      // Start consuming SMS jobs
      await this.startConsuming();
      
      logger.info('SMS Worker started successfully');
      
      // Graceful shutdown
      process.on('SIGINT', () => this.stop());
      process.on('SIGTERM', () => this.stop());
      
    } catch (error) {
      logger.error('SMS Worker startup failed:', error);
      process.exit(1);
    }
  }

  async startConsuming() {
    const queueName = 'medium_priority_notifications'; // Process medium priority SMS
    
    await queueService.consumeQueue(queueName, (job) => this.processSMSJob(job));
    logger.info(`SMS Worker consuming from ${queueName}`);
  }

  async processSMSJob(job) {
    if (job.type !== 'sms') {
      logger.warn(`SMS Worker received non-SMS job: ${job.type}`);
      return;
    }

    const startTime = Date.now();
    
    try {
      logger.info(`Processing SMS job ${job.jobId} to ${job.recipient}`);
      
      // Update status to processing
      await notificationService.updateJobStatus(job.jobId, 'processing', 'SMS being processed by worker');
      
      // Simulate SMS sending
      await this.sendSMS(job);

      // Update status to sent
      await notificationService.updateJobStatus(
        job.jobId, 
        'sent', 
        'SMS sent successfully',
        { 
          provider: 'mock-sms',
          processingTime: Date.now() - startTime,
          worker: 'sms-worker-1'
        }
      );

      // Simulate delivery confirmation (async)
      setTimeout(async () => {
        if (Math.random() < 0.98) { // 98% delivery rate for SMS
          await notificationService.updateJobStatus(
            job.jobId, 
            'delivered', 
            'SMS delivered successfully'
          );
        }
      }, Math.random() * 3000 + 1000); // 1-4 seconds delay

      this.processedCount++;
      logger.info(`SMS job ${job.jobId} completed in ${Date.now() - startTime}ms`);
      
    } catch (error) {
      this.errorCount++;
      logger.error(`SMS job ${job.jobId} failed:`, error);
      
      // Handle job failure with retry logic
      await notificationService.handleJobFailure(job.jobId, error.message);
    }
  }

  async sendSMS(job) {
    // Simulate SMS provider API call
    const delay = Math.random() * 500 + 200; // 200-700ms delay
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Simulate 98% success rate
    if (Math.random() < 0.98) {
      logger.info(`Mock SMS sent to ${job.recipient}: ${job.message.substring(0, 50)}...`);
      return { success: true, messageId: `sms_${Date.now()}` };
    } else {
      throw new Error('SMS provider rate limit exceeded');
    }
  }

  async stop() {
    logger.info('Stopping SMS Worker...');
    this.isRunning = false;
    
    await queueService.close();
    if (process.env.DEMO_MODE !== 'true') {
      await mongoose.connection.close();
    }
    
    logger.info(`SMS Worker stopped. Processed: ${this.processedCount}, Errors: ${this.errorCount}`);
    process.exit(0);
  }

  getStats() {
    return {
      type: 'sms',
      isRunning: this.isRunning,
      processedCount: this.processedCount,
      errorCount: this.errorCount,
      uptime: process.uptime()
    };
  }
}

// Start worker if this file is run directly
if (require.main === module) {
  const worker = new SMSWorker();
  worker.start().catch(error => {
    logger.error('SMS Worker failed to start:', error);
    process.exit(1);
  });
}

module.exports = SMSWorker;