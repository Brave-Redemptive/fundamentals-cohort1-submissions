import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
  type: "email" | "sms" | "push";
  payload: any;
  status: "queued" | "processing" | "sent" | "failed";
  attempts: number;
  error?: string;
}

const JobSchema = new Schema<IJob>(
  {
    type: { type: String, required: true },
    payload: { type: Object, required: true },
    status: { type: String, default: "queued" },
    attempts: { type: Number, default: 0 },
    error: { type: String },
  },
  { timestamps: true }
);

export const Job = mongoose.model<IJob>("Job", JobSchema);
