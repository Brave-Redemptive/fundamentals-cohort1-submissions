/**
 * Queue Service - Samuel Ajewole
 * Software Engineering Week 12 Challenge
 */

const amqp = require('amqplib');
const logger = require('../utils/logger');

class QueueService {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.queues = {
      high: 'high_priority_notifications',
      medium: 'medium_priority_notifications',
      low: 'low_priority_notifications',
      retry: 'retry_notifications',
      dlq: 'failed_notifications'
    };
  }

  async connect() {
    if (process.env.DEMO_MODE === 'true') {
      logger.info('RabbitMQ: Running in demo mode (mock queue)');
      return true;
    }
    
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();

      // Setup queues
      await this.setupQueues();
      
      logger.info('Connected to RabbitMQ');
      return true;
    } catch (error) {
      logger.error('RabbitMQ connection failed:', error);
      return false;
    }
  }

  async setupQueues() {
    // Create all queues
    for (const [priority, queueName] of Object.entries(this.queues)) {
      await this.channel.assertQueue(queueName, {
        durable: true,
        arguments: priority === 'dlq' ? {} : {
          'x-dead-letter-exchange': '',
          'x-dead-letter-routing-key': this.queues.dlq
        }
      });
    }

    logger.info('RabbitMQ queues setup complete');
  }

  async publishJob(job) {
    if (process.env.DEMO_MODE === 'true') {
      logger.info(`Demo: Job ${job.jobId} queued for ${job.priority} priority`);
      return Promise.resolve();
    }
    
    if (!this.channel) {
      await this.connect();
    }

    const queueName = this.queues[job.priority] || this.queues.medium;
    const message = Buffer.from(JSON.stringify({
      jobId: job.jobId,
      type: job.type,
      recipient: job.recipient,
      subject: job.subject,
      message: job.message,
      priority: job.priority,
      metadata: job.metadata,
      attempts: job.attempts || 0
    }));

    return this.channel.sendToQueue(queueName, message, {
      persistent: true,
      priority: job.priority === 'high' ? 10 : job.priority === 'medium' ? 5 : 1
    });
  }

  async publishRetry(job, delay) {
    if (!this.channel) {
      await this.connect();
    }

    const message = Buffer.from(JSON.stringify({
      jobId: job.jobId,
      type: job.type,
      recipient: job.recipient,
      subject: job.subject,
      message: job.message,
      priority: job.priority,
      metadata: job.metadata,
      attempts: job.attempts,
      retryDelay: delay
    }));

    // Use delay queue or setTimeout for retry
    setTimeout(() => {
      const queueName = this.queues[job.priority] || this.queues.medium;
      this.channel.sendToQueue(queueName, message, { persistent: true });
    }, delay);
  }

  async consumeQueue(queueName, callback) {
    if (!this.channel) {
      await this.connect();
    }

    await this.channel.consume(queueName, async (msg) => {
      if (msg) {
        try {
          const job = JSON.parse(msg.content.toString());
          await callback(job);
          this.channel.ack(msg);
        } catch (error) {
          logger.error('Queue processing error:', error);
          this.channel.nack(msg, false, false); // Send to DLQ
        }
      }
    });
  }

  async getQueueStats() {
    if (process.env.DEMO_MODE === 'true') {
      return {
        high: { messageCount: 0, consumerCount: 1 },
        medium: { messageCount: 0, consumerCount: 1 },
        low: { messageCount: 0, consumerCount: 1 },
        retry: { messageCount: 0, consumerCount: 1 },
        dlq: { messageCount: 0, consumerCount: 0 }
      };
    }
    
    if (!this.channel) {
      await this.connect();
    }

    const stats = {};
    
    for (const [priority, queueName] of Object.entries(this.queues)) {
      try {
        const queueInfo = await this.channel.checkQueue(queueName);
        stats[priority] = {
          messageCount: queueInfo.messageCount,
          consumerCount: queueInfo.consumerCount
        };
      } catch (error) {
        stats[priority] = { messageCount: 0, consumerCount: 0 };
      }
    }

    return stats;
  }

  async close() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }
}

module.exports = new QueueService();