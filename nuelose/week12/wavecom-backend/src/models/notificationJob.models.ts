import mongoose, { Document, Schema } from "mongoose";
import { NotificationType, NotificationPayload } from "../types";

export interface INotificationJob extends Document {
  type: NotificationType;
  to: string;
  payload: NotificationPayload;
  status: "pending" | "processing" | "sent" | "failed";
  attempts: number;
  maxRetries: number;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationJobSchema = new Schema<INotificationJob>(
  {
    type: { type: String, enum: ["email", "sms", "push"], required: true },
    to: { type: String, required: true },
    payload: { type: Schema.Types.Mixed, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "sent", "failed"],
      default: "pending",
    },
    attempts: { type: Number, default: 0 },
    maxRetries: { type: Number, default: 5 },
    error: String,
  },
  { timestamps: true }
);

export default mongoose.model<INotificationJob>(
  "NotificationJob",
  NotificationJobSchema
);
