import amqp, { Connection, Channel } from 'amqplib';
import { logger } from './logger';
import { QUEUE_NAMES, ERROR_MESSAGES } from '../utils/constants';

class RabbitMQConnection {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private isConnecting = false;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  private readonly RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
  private readonly RECONNECT_DELAY = 5000;

  async connect(): Promise<void> {
    if (this.isConnecting) {
      logger.debug('Connection attempt already in progress');
      return;
    }

    if (this.connection && this.channel) {
      logger.debug('Already connected to RabbitMQ');
      return;
    }

    this.isConnecting = true;

    try {
      // Create connection
      this.connection = await amqp.connect(this.RABBITMQ_URL);
      logger.info('RabbitMQ connection established');

      // Create channel
      this.channel = await this.connection.createChannel();
      logger.info('RabbitMQ channel created');

      // Set prefetch count for better load distribution
      await this.channel.prefetch(10);

      // Setup queues
      await this.setupQueues();

      // Handle connection events
      this.connection.on('error', (err) => {
        logger.error('RabbitMQ connection error:', err);
        this.handleConnectionError();
      });

      this.connection.on('close', () => {
        logger.warn('RabbitMQ connection closed');
        this.handleConnectionClose();
      });

      this.isConnecting = false;
    } catch (error) {
      this.isConnecting = false;
      logger.error('Failed to connect to RabbitMQ:', error);
      this.scheduleReconnect();
      throw new Error(ERROR_MESSAGES.QUEUE_CONNECTION_FAILED);
    }
  }

  private async setupQueues(): Promise<void> {
    if (!this.channel) {
      throw new Error('Channel not initialized');
    }

    // Main notification queue
    await this.channel.assertQueue(QUEUE_NAMES.NOTIFICATIONS, {
      durable: true,
      arguments: {
        'x-message-ttl': 3600000, // 1 hour
        'x-dead-letter-exchange': '',
        'x-dead-letter-routing-key': QUEUE_NAMES.DLQ
      }
    });

    // Dead Letter Queue
    await this.channel.assertQueue(QUEUE_NAMES.DLQ, {
      durable: true
    });

    // High priority queue
    await this.channel.assertQueue(QUEUE_NAMES.HIGH_PRIORITY, {
      durable: true,
      arguments: {
        'x-max-priority': 10
      }
    });

    // Retry queue with delayed processing
    await this.channel.assertQueue(QUEUE_NAMES.RETRY, {
      durable: true,
      arguments: {
        'x-message-ttl': 30000, // 30 seconds delay
        'x-dead-letter-exchange': '',
        'x-dead-letter-routing-key': QUEUE_NAMES.NOTIFICATIONS
      }
    });

    logger.info('RabbitMQ queues setup completed');
  }

  private handleConnectionError(): void {
    this.cleanup();
    this.scheduleReconnect();
  }

  private handleConnectionClose(): void {
    this.cleanup();
    this.scheduleReconnect();
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = setTimeout(async () => {
      logger.info('Attempting to reconnect to RabbitMQ...');
      try {
        await this.connect();
      } catch (error) {
        logger.error('Reconnection failed:', error);
      }
    }, this.RECONNECT_DELAY);
  }

  private cleanup(): void {
    this.connection = null;
    this.channel = null;
  }

  getChannel(): Channel {
    if (!this.channel) {
      throw new Error('Channel not initialized. Call connect() first.');
    }
    return this.channel;
  }

  async close(): Promise<void> {
    try {
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
      }

      if (this.channel) {
        await this.channel.close();
      }

      if (this.connection) {
        await this.connection.close();
      }

      this.cleanup();
      logger.info('RabbitMQ connection closed gracefully');
    } catch (error) {
      logger.error('Error closing RabbitMQ connection:', error);
      throw error;
    }
  }

  isConnected(): boolean {
    return this.connection !== null && this.channel !== null;
  }
}

export const rabbitMQ = new RabbitMQConnection();