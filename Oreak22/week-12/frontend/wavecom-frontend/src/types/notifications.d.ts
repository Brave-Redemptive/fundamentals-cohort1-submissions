export type NotificationType = "email" | "sms" | "push";

export interface JobLog {
  provider: string;
  attemptAt?: string;
  success: boolean;
  response?: any;
}

export interface Job {
  _id?: string;
  jobId?: string;
  type: NotificationType;
  to: Record<string, any>;
  payload?: Record<string, any>;
  status: "queued" | "processing" | "delivered" | "failed" | "pending" | "sent";
  attempts?: number;
  maxAttempts?: number;
  logs?: JobLog[];
  createdAt?: string;
  updatedAt?: string;
}
