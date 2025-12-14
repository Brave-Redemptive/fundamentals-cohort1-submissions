import mongoose from "mongoose";

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("Mongo Error:", err);
    process.exit(1);
  }
}
