// Notification Types
export enum NotificationType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
}

// Notification Status
export enum NotificationStatus {
  PENDING = 'PENDING',
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  RETRYING = 'RETRYING',
}

// Notification Priority
export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// Notification Interface
export interface Notification {
  id: string;
  _id?: string;
  type: NotificationType;
  recipient: string;
  subject?: string;
  message: string;
  status: NotificationStatus;
  priority: Priority;
  retryCount: number;
  maxRetries: number;
  metadata?: Record<string, any>;
  scheduledAt?: string;
  sentAt?: string;
  failedAt?: string;
  error?: string;
  providerMessageId?: string;
  processingTimeMs?: number;
  createdAt: string;
  updatedAt: string;
}

// Notification Log Interface
export interface NotificationLog {
  id: string;
  _id?: string;
  notificationId: string;
  status: string;
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
  error?: string;
}

// API Response Interfaces
export interface NotificationResponse {
  success: boolean;
  data: Notification;
  message?: string;
}

export interface NotificationListResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export interface NotificationDetailResponse {
  success: boolean;
  data: {
    notification: Notification;
    logs: NotificationLog[];
  };
}

export interface SystemStats {
  total: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
  queueDepth?: Record<string, number>;
  averageProcessingTime?: number;
  successRate?: number;
}

export interface SystemStatsResponse {
  success: boolean;
  data: SystemStats;
}

// Create Notification Request
export interface CreateNotificationRequest {
  type: NotificationType;
  recipient: string;
  subject?: string;
  message: string;
  priority?: Priority;
  metadata?: Record<string, any>;
}

// Filter Options
export interface NotificationFilters {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  priority?: string;
}
