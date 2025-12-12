export type NotificationType = "email" | "sms" | "push";

export interface NotificationPayload {
  subject?: string;
  message: string;
  [key: string]: any;
}

export interface CreateNotificationDto {
  type: NotificationType;
  to: string;
  payload: NotificationPayload;
}

export interface QueueMessage {
  jobId: string;
  attempt?: number;
}
