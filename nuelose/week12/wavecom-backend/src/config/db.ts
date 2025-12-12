import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/wavecom";
    await mongoose.connect(uri);
    console.log("MongoDB Connected ", uri);
  } catch (err: any) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};
