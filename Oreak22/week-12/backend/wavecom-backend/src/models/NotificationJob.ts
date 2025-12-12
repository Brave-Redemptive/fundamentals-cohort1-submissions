import mongoose, { Schema, Document } from "mongoose";

export interface INotificationJob extends Document {
  type: "email" | "sms" | "push";
  payload: any;
  status: "pending" | "processing" | "sent" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema(
  {
    type: { type: String, required: true },
    payload: { type: Object, required: true },
    to: { type: Object, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model<INotificationJob>("NotificationJob", JobSchema);
