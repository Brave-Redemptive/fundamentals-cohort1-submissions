import { NotificationType } from '../types/notification';

const FAILURE_RATE = 0.1;
const LATENCY_MIN = 100;
const LATENCY_MAX = 500;

const simulateLatency = (): Promise<void> => {
  const delay = Math.random() * (LATENCY_MAX - LATENCY_MIN) + LATENCY_MIN;
  return new Promise(resolve => setTimeout(resolve, delay));
};

const shouldFail = (): boolean => Math.random() < FAILURE_RATE;

export const sendEmail = async (recipient: string, subject: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  await simulateLatency();
  
  if (shouldFail()) {
    return { success: false, error: 'Email provider temporarily unavailable' };
  }
  
  console.log(`[EMAIL] Sent to ${recipient}: ${subject}`);
  return { success: true, messageId: `email_${Date.now()}` };
};

export const sendSMS = async (recipient: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  await simulateLatency();
  
  if (shouldFail()) {
    return { success: false, error: 'SMS gateway timeout' };
  }
  
  console.log(`[SMS] Sent to ${recipient}: ${message.substring(0, 50)}...`);
  return { success: true, messageId: `sms_${Date.now()}` };
};

export const sendPush = async (recipient: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  await simulateLatency();
  
  if (shouldFail()) {
    return { success: false, error: 'Push notification service error' };
  }
  
  console.log(`[PUSH] Sent to ${recipient}: ${message.substring(0, 50)}...`);
  return { success: true, messageId: `push_${Date.now()}` };
};

export const dispatchNotification = async (
  type: NotificationType,
  recipient: string,
  message: string,
  subject?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  switch (type) {
    case 'email':
      return sendEmail(recipient, subject || 'Notification', message);
    case 'sms':
      return sendSMS(recipient, message);
    case 'push':
      return sendPush(recipient, message);
    default:
      return { success: false, error: 'Unknown notification type' };
  }
};
