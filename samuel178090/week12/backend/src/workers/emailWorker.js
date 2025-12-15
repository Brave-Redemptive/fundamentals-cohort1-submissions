/**
 * Email Worker Process - Samuel Ajewole
 * Software Engineering Week 12 Challenge
 */

require('dotenv').config();
const mongoose = require('mongoose');
const queueService = require('../services/queueService');
const notificationService = require('../services/notificationService');
const logger = require('../utils/logger');

class EmailWorker {
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
        logger.info('Email Worker connected to MongoDB');
      }

      // Connect to RabbitMQ
      await queueService.connect();
      logger.info('Email Worker connected to RabbitMQ');

      this.isRunning = true;
      
      // Start consuming email jobs
      await this.startConsuming();
      
      logger.info('Email Worker started successfully');
      
      // Graceful shutdown
      process.on('SIGINT', () => this.stop());
      process.on('SIGTERM', () => this.stop());
      
    } catch (error) {
      logger.error('Email Worker startup failed:', error);
      process.exit(1);
    }
  }

  async startConsuming() {
    const queueName = 'high_priority_notifications'; // Process high priority emails
    
    await queueService.consumeQueue(queueName, (job) => this.processEmailJob(job));
    logger.info(`Email Worker consuming from ${queueName}`);
  }

  async processEmailJob(job) {
    if (job.type !== 'email') {
      logger.warn(`Email Worker received non-email job: ${job.type}`);
      return;
    }

    const startTime = Date.now();
    
    try {
      logger.info(`Processing email job ${job.jobId} to ${job.recipient}`);
      
      // Update status to processing
      await notificationService.updateJobStatus(job.jobId, 'processing', 'Email being processed by worker');
      
      // Simulate email sending with realistic delay
      await this.sendEmail(job);

      // Update status to sent
      await notificationService.updateJobStatus(
        job.jobId, 
        'sent', 
        'Email sent successfully',
        { 
          provider: 'mock-email',
          processingTime: Date.now() - startTime,
          worker: 'email-worker-1'
        }
      );

      // Simulate delivery confirmation (async)
      setTimeout(async () => {
        if (Math.random() < 0.95) { // 95% delivery rate for emails
          await notificationService.updateJobStatus(
            job.jobId, 
            'delivered', 
            'Email delivered successfully'
          );
        }
      }, Math.random() * 5000 + 2000); // 2-7 seconds delay

      this.processedCount++;
      logger.info(`Email job ${job.jobId} completed in ${Date.now() - startTime}ms`);
      
    } catch (error) {
      this.errorCount++;
      logger.error(`Email job ${job.jobId} failed:`, error);
      
      // Handle job failure with retry logic
      await notificationService.handleJobFailure(job.jobId, error.message);
    }
  }

  async sendEmail(job) {
    // Simulate email provider API call
    const delay = Math.random() * 1000 + 500; // 500-1500ms delay
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Simulate 95% success rate
    if (Math.random() < 0.95) {
      logger.info(`Mock email sent to ${job.recipient}: ${job.subject || 'No Subject'}`);
      return { success: true, messageId: `email_${Date.now()}` };
    } else {
      throw new Error('Email provider temporarily unavailable');
    }
  }

  async stop() {
    logger.info('Stopping Email Worker...');
    this.isRunning = false;
    
    await queueService.close();
    if (process.env.DEMO_MODE !== 'true') {
      await mongoose.connection.close();
    }
    
    logger.info(`Email Worker stopped. Processed: ${this.processedCount}, Errors: ${this.errorCount}`);
    process.exit(0);
  }

  getStats() {
    return {
      type: 'email',
      isRunning: this.isRunning,
      processedCount: this.processedCount,
      errorCount: this.errorCount,
      uptime: process.uptime()
    };
  }
}

// Start worker if this file is run directly
if (require.main === module) {
  const worker = new EmailWorker();
  worker.start().catch(error => {
    logger.error('Email Worker failed to start:', error);
    process.exit(1);
  });
}

module.exports = EmailWorker;