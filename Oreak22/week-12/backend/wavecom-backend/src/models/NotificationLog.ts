import mongoose, { Schema, Document } from "mongoose";

export interface INotificationLog extends Document {
  jobId: string;
  message: string;
  timestamp: Date;
}

const LogSchema = new Schema(
  {
    jobId: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<INotificationLog>("NotificationLog", LogSchema);
