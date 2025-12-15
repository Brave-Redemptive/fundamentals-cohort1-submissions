// src/models/Job.ts
import mongoose, { Document, Schema } from "mongoose";
import { notificationChannels, notificationStatus } from "../utils/enums";

export interface INotificationJob extends Document {
  channel: notificationChannels
  phoneNumber?: string;
  email?: string;
  message: string;
  deviceId?: string
  metadata?: Record<string, any>;
  status: notificationStatus
  retryCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationJobSchema = new Schema<INotificationJob>(
  {
    channel: {
      type: String,
      enum: Object.values(notificationChannels),
      required: true
    },
    phoneNumber: String,
    email: String,
    message: { type: String, required: true },
    metadata: { type: Object },

    status: {
      type: String,
      enum: Object.values(notificationStatus),
      default: notificationStatus.queued
    },
    deviceId:{
      type: String
    },
    retryCount: {
      type: Number,
      default: 0,
      max: 3
    }
  },
  { timestamps: true }
);

export default mongoose.model<INotificationJob>("NotificationJob", NotificationJobSchema);
