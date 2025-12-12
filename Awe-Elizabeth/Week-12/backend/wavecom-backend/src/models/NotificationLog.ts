// src/models/Log.ts
import mongoose, { Document, Schema } from "mongoose";
import { notificationChannels, notificationStatus } from "../utils/enums";

export interface INotificationLog extends Document {
  notificationJobId: mongoose.Types.ObjectId;
  event: string;
  status: notificationStatus;
  channel: notificationChannels;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationLogSchema = new Schema<INotificationLog>(
  {
    notificationJobId: {
      type: Schema.Types.ObjectId,
      ref: "NotificationJob",
      required: true
    },
    event: { type: String, required: true },
    status: {
        type: String,
        enum: Object.values(notificationStatus),
        default: notificationStatus.queued
    },
    channel: {
        type: String,
        enum: Object.values(notificationChannels),
        required: true
    }  
  },
  { timestamps: true }
);

export default mongoose.model<INotificationLog>("NotificationLog", NotificationLogSchema);
