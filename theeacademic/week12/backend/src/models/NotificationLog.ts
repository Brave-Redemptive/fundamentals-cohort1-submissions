import mongoose, { Schema, Document } from 'mongoose';
import { NotificationLog } from '../types/notification';

export interface INotificationLog extends NotificationLog, Document {}

const NotificationLogSchema = new Schema<INotificationLog>({
  jobId: { type: String, required: true, index: true },
  status: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<INotificationLog>('NotificationLog', NotificationLogSchema);
