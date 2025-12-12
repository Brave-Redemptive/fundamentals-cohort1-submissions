import amqp, { Connection, Channel } from 'amqplib';

let connection: Connection | null = null;
let channel: Channel | null = null;

export const NOTIFICATION_QUEUE = 'notification_queue';
export const RETRY_QUEUE = 'notification_retry_queue';
export const DEAD_LETTER_QUEUE = 'notification_dlq';

export const connectRabbitMQ = async (): Promise<Channel> => {
  const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
  
  try {
    connection = await amqp.connect(rabbitUrl);
    channel = await connection.createChannel();
    
    await channel.assertQueue(DEAD_LETTER_QUEUE, { durable: true });
    
    await channel.assertQueue(NOTIFICATION_QUEUE, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': '',
        'x-dead-letter-routing-key': DEAD_LETTER_QUEUE
      }
    });
    
    await channel.assertQueue(RETRY_QUEUE, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': '',
        'x-dead-letter-routing-key': NOTIFICATION_QUEUE,
        'x-message-ttl': 30000
      }
    });
    
    await channel.prefetch(10);
    
    console.log('Connected to RabbitMQ');
    return channel;
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
    throw error;
  }
};

export const getChannel = (): Channel | null => channel;

export const closeRabbitMQ = async (): Promise<void> => {
  if (channel) await channel.close();
  if (connection) await connection.close();
};
