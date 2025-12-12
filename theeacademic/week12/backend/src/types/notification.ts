export type NotificationType = 'email' | 'sms' | 'push';
export type NotificationStatus = 'pending' | 'queued' | 'processing' | 'sent' | 'failed';

export interface NotificationPayload {
  type: NotificationType;
  recipient: string;
  subject?: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationJob {
  jobId: string;
  type: NotificationType;
  recipient: string;
  subject?: string;
  message: string;
  status: NotificationStatus;
  retryCount: number;
  maxRetries: number;
  createdAt: Date;
  updatedAt: Date;
  sentAt?: Date;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationLog {
  jobId: string;
  status: NotificationStatus;
  message: string;
  timestamp: Date;
}
