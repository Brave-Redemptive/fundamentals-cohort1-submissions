export type NotificationType = 'email' | 'sms' | 'push';
export type NotificationStatus = 'pending' | 'queued' | 'processing' | 'sent' | 'failed';

export interface NotificationPayload {
  type: NotificationType;
  recipient: string;
  subject?: string;
  message: string;
}

export interface NotificationJobResponse {
  jobId: string;
  type: NotificationType;
  recipient: string;
  status: NotificationStatus;
  retryCount: number;
  createdAt: string;
  sentAt?: string;
  error?: string;
}

export interface NotificationLog {
  jobId: string;
  status: NotificationStatus;
  message: string;
  timestamp: string;
}

export interface JobDetailResponse {
  jobId: string;
  type: NotificationType;
  recipient: string;
  status: NotificationStatus;
  retryCount: number;
  createdAt: string;
  sentAt?: string;
  error?: string;
  logs: NotificationLog[];
}

export interface JobsListResponse {
  jobs: NotificationJobResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface StatsResponse {
  pending: number;
  queued: number;
  processing: number;
  sent: number;
  failed: number;
}
