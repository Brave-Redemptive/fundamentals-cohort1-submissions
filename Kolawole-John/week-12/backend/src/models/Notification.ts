import mongoose, { Schema, Document } from 'mongoose';
import { NotificationType, NotificationStatus, Priority } from '../types';

export interface INotification extends Document {
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
  providerMessageId?: string;
  processingTimeMs?: number;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
      index: true
    },
    recipient: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    subject: {
      type: String,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(NotificationStatus),
      default: NotificationStatus.PENDING,
      index: true
    },
    priority: {
      type: String,
      enum: Object.values(Priority),
      default: Priority.MEDIUM,
      index: true
    },
    retryCount: {
      type: Number,
      default: 0
    },
    maxRetries: {
      type: Number,
      default: 3
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {}
    },
    scheduledAt: {
      type: Date,
      index: true
    },
    sentAt: {
      type: Date
    },
    failedAt: {
      type: Date
    },
    error: {
      type: String
    },
    providerMessageId: {
      type: String
    },
    processingTimeMs: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

// Indexes for common queries
NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ status: 1, createdAt: -1 });
NotificationSchema.index({ type: 1, status: 1 });
NotificationSchema.index({ recipient: 1, createdAt: -1 });

// Compound index for analytics
NotificationSchema.index({ type: 1, status: 1, createdAt: -1 });

// Virtual for checking if notification should be retried
NotificationSchema.virtual('canRetry').get(function(this: INotification) {
  return this.retryCount < this.maxRetries && 
         this.status === NotificationStatus.FAILED;
});

// Instance method to increment retry count
NotificationSchema.methods.incrementRetry = function() {
  this.retryCount += 1;
  this.status = NotificationStatus.RETRYING;
  return this.save();
};

// Static method to get statistics
NotificationSchema.statics.getStats = async function(startDate?: Date, endDate?: Date) {
  const match: any = {};
  
  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = startDate;
    if (endDate) match.createdAt.$lte = endDate;
  }

  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgProcessingTime: { $avg: '$processingTimeMs' }
      }
    }
  ]);
};

// Static method to get queue depth by status
NotificationSchema.statics.getQueueDepth = async function() {
  return this.countDocuments({
    status: { 
      $in: [NotificationStatus.PENDING, NotificationStatus.QUEUED, NotificationStatus.PROCESSING] 
    }
  });
};

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);