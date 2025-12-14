import mongoose, { Schema, Document } from 'mongoose';
import { NotificationStatus } from '../types';

export interface INotificationLog extends Document {
  notificationId: mongoose.Types.ObjectId;
  status: NotificationStatus;
  message: string;
  metadata?: Record<string, any>;
  error?: string;
  timestamp: Date;
}

const NotificationLogSchema = new Schema<INotificationLog>(
  {
    notificationId: {
      type: Schema.Types.ObjectId,
      ref: 'Notification',
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: Object.values(NotificationStatus),
      required: true
    },
    message: {
      type: String,
      required: true
    },
    metadata: {
      type: Schema.Types.Mixed
    },
    error: {
      type: String
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: false
  }
);

// Compound index for querying logs by notification and time
NotificationLogSchema.index({ notificationId: 1, timestamp: -1 });

// TTL index to auto-delete old logs after 30 days
NotificationLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 });

// Static method to create log entry
NotificationLogSchema.statics.createLog = async function(
  notificationId: mongoose.Types.ObjectId,
  status: NotificationStatus,
  message: string,
  metadata?: Record<string, any>,
  error?: string
) {
  return this.create({
    notificationId,
    status,
    message,
    metadata,
    error,
    timestamp: new Date()
  });
};

// Static method to get logs for a notification
NotificationLogSchema.statics.getNotificationLogs = async function(
  notificationId: mongoose.Types.ObjectId
) {
  return this.find({ notificationId }).sort({ timestamp: 1 });
};

export const NotificationLog = mongoose.model<INotificationLog>(
  'NotificationLog',
  NotificationLogSchema
);