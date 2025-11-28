import mongoose, { Schema } from "mongoose"

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  role: { type: String,   enum: ["admin", "patient", "doctor"], required: true },
  password: { type: String, required: true },
  age: { type: Number, default: null },
  assignedDoctor: { type: Schema.Types.ObjectId, ref: "User", default: null },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
  refreshToken: { type: String },
  tokenHash: { type: String, default: null },
  tokenExpiry: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
