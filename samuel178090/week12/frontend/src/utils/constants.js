export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const NOTIFICATION_TYPES = {
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push'
};

export const NOTIFICATION_STATUS = {
  QUEUED: 'queued',
  PROCESSING: 'processing',
  SENT: 'sent',
  DELIVERED: 'delivered',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

export const PRIORITY_LEVELS = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

export const STATUS_COLORS = {
  [NOTIFICATION_STATUS.QUEUED]: '#f59e0b',
  [NOTIFICATION_STATUS.PROCESSING]: '#8b5cf6',
  [NOTIFICATION_STATUS.SENT]: '#10b981',
  [NOTIFICATION_STATUS.DELIVERED]: '#059669',
  [NOTIFICATION_STATUS.FAILED]: '#ef4444',
  [NOTIFICATION_STATUS.CANCELLED]: '#6b7280'
};

export const TYPE_COLORS = {
  [NOTIFICATION_TYPES.EMAIL]: '#8b5cf6',
  [NOTIFICATION_TYPES.SMS]: '#06b6d4',
  [NOTIFICATION_TYPES.PUSH]: '#ec4899'
};

export const POLLING_INTERVAL = 5000; // 5 seconds
export const MAX_RETRIES = 3;
export const PAGE_SIZE = 20;