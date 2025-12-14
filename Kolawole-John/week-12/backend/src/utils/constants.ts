export const QUEUE_NAMES = {
  NOTIFICATIONS: 'notifications',
  DLQ: 'notifications_dlq',
  HIGH_PRIORITY: 'notifications_high_priority',
  RETRY: 'notifications_retry'
};

export const RETRY_CONFIG = {
  MAX_ATTEMPTS: parseInt(process.env.MAX_RETRY_ATTEMPTS || '3'),
  INITIAL_DELAY_MS: parseInt(process.env.RETRY_DELAY_MS || '5000'),
  BACKOFF_MULTIPLIER: 2,
  MAX_DELAY_MS: 60000 // 1 minute max delay
};

export const RATE_LIMITS = {
  WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
  MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
};

export const PROVIDER_TIMEOUTS = {
  EMAIL: 10000, // 10 seconds
  SMS: 5000,    // 5 seconds
  PUSH: 3000    // 3 seconds
};

export const WORKER_CONFIG = {
  PREFETCH_COUNT: 10, // Process 10 messages at a time
  CONSUMER_TAG: 'wavecom-notification-worker',
  RECONNECT_DELAY_MS: 5000
};

export const METRICS_CONFIG = {
  COLLECTION_INTERVAL_MS: 10000, // Collect metrics every 10 seconds
  RETENTION_HOURS: 24
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

export const ERROR_MESSAGES = {
  INVALID_NOTIFICATION_TYPE: 'Invalid notification type. Must be email, sms, or push',
  INVALID_RECIPIENT: 'Invalid recipient format',
  MISSING_REQUIRED_FIELDS: 'Missing required fields',
  QUEUE_CONNECTION_FAILED: 'Failed to connect to message queue',
  DATABASE_CONNECTION_FAILED: 'Failed to connect to database',
  PROVIDER_UNAVAILABLE: 'Notification provider unavailable',
  JOB_NOT_FOUND: 'Notification job not found',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please try again later'
};

export const SUCCESS_MESSAGES = {
  NOTIFICATION_CREATED: 'Notification job created successfully',
  NOTIFICATION_SENT: 'Notification sent successfully',
  NOTIFICATION_QUEUED: 'Notification queued for processing'
};