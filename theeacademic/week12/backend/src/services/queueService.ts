import { getChannel, NOTIFICATION_QUEUE, RETRY_QUEUE } from '../config/rabbitmq';
import NotificationJob from '../models/NotificationJob';
import NotificationLog from '../models/NotificationLog';
import { dispatchNotification } from './mockProviders';

export const publishToQueue = async (jobId: string): Promise<void> => {
  const channel = getChannel();
  if (!channel) throw new Error('RabbitMQ channel not available');
  
  channel.sendToQueue(NOTIFICATION_QUEUE, Buffer.from(jobId), { persistent: true });
  
  await NotificationJob.findByIdAndUpdate(jobId, { status: 'queued' });
  await NotificationLog.create({
    jobId,
    status: 'queued',
    message: 'Job added to queue'
  });
};

export const publishToRetryQueue = async (jobId: string): Promise<void> => {
  const channel = getChannel();
  if (!channel) throw new Error('RabbitMQ channel not available');
  
  channel.sendToQueue(RETRY_QUEUE, Buffer.from(jobId), { persistent: true });
};

export const startConsumer = async (): Promise<void> => {
  const channel = getChannel();
  if (!channel) throw new Error('RabbitMQ channel not available');
  
  channel.consume(NOTIFICATION_QUEUE, async (msg) => {
    if (!msg) return;
    
    const jobId = msg.content.toString();
    
    try {
      const job = await NotificationJob.findById(jobId);
      if (!job) {
        channel.ack(msg);
        return;
      }
      
      await NotificationJob.findByIdAndUpdate(jobId, { status: 'processing' });
      await NotificationLog.create({
        jobId,
        status: 'processing',
        message: `Processing attempt ${job.retryCount + 1}`
      });
      
      const result = await dispatchNotification(
        job.type,
        job.recipient,
        job.message,
        job.subject
      );
      
      if (result.success) {
        await NotificationJob.findByIdAndUpdate(jobId, {
          status: 'sent',
          sentAt: new Date()
        });
        await NotificationLog.create({
          jobId,
          status: 'sent',
          message: `Successfully sent via ${job.type}`
        });
        channel.ack(msg);
      } else {
        await handleFailure(jobId, job.retryCount, job.maxRetries, result.error || 'Unknown error');
        channel.ack(msg);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const job = await NotificationJob.findById(jobId);
      if (job) {
        await handleFailure(jobId, job.retryCount, job.maxRetries, errorMessage);
      }
      channel.ack(msg);
    }
  });
  
  console.log('Queue consumer started');
};

const handleFailure = async (jobId: string, retryCount: number, maxRetries: number, error: string): Promise<void> => {
  if (retryCount < maxRetries) {
    await NotificationJob.findByIdAndUpdate(jobId, {
      status: 'queued',
      retryCount: retryCount + 1,
      error
    });
    await NotificationLog.create({
      jobId,
      status: 'queued',
      message: `Retry ${retryCount + 1}/${maxRetries}: ${error}`
    });
    await publishToRetryQueue(jobId);
  } else {
    await NotificationJob.findByIdAndUpdate(jobId, {
      status: 'failed',
      error
    });
    await NotificationLog.create({
      jobId,
      status: 'failed',
      message: `Failed after ${maxRetries} retries: ${error}`
    });
  }
};
