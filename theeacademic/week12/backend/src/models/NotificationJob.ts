import mongoose, { Schema, Document } from 'mongoose';
import { NotificationJob, NotificationStatus, NotificationType } from '../types/notification';

export interface INotificationJob extends Omit<NotificationJob, 'jobId'>, Document {}

const NotificationJobSchema = new Schema<INotificationJob>({
  type: { type: String, enum: ['email', 'sms', 'push'], required: true },
  recipient: { type: String, required: true },
  subject: { type: String },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'queued', 'processing', 'sent', 'failed'], 
    default: 'pending' 
  },
  retryCount: { type: Number, default: 0 },
  maxRetries: { type: Number, default: 3 },
  sentAt: { type: Date },
  error: { type: String },
  metadata: { type: Schema.Types.Mixed }
}, { timestamps: true });

NotificationJobSchema.index({ status: 1, createdAt: -1 });
NotificationJobSchema.index({ recipient: 1 });

export default mongoose.model<INotificationJob>('NotificationJob', NotificationJobSchema);
