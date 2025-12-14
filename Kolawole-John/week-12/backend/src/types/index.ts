export enum NotificationType {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push'
}

export enum NotificationStatus {
  PENDING = 'pending',
  QUEUED = 'queued',
  PROCESSING = 'processing',
  SENT = 'sent',
  FAILED = 'failed',
  RETRYING = 'retrying'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface NotificationPayload {
  type: NotificationType;
  recipient: string;
  subject?: string;
  message: string;
  metadata?: Record<string, any>;
  priority?: Priority;
  scheduledAt?: Date;
}

export interface NotificationJob {
  id: string;
  type: NotificationType;
  recipient: string;
  subject?: string;
  message: string;
  status: NotificationStatus;
  priority: Priority;
  retryCount: number;
  maxRetries: number;
  metadata?: Record<string, any>;
  scheduledAt?: Date;
  sentAt?: Date;
  failedAt?: Date;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProviderResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp: Date;
}

export interface QueueMessage {
  jobId: string;
  type: NotificationType;
  recipient: string;
  subject?: string;
  message: string;
  priority: Priority;
  retryCount: number;
  metadata?: Record<string, any>;
}

export interface RetryStrategy {
  maxAttempts: number;
  backoffMultiplier: number;
  initialDelayMs: number;
}

export interface SystemMetrics {
  totalNotifications: number;
  successRate: number;
  failureRate: number;
  averageProcessingTime: number;
  queueDepth: number;
  workersActive: number;
}