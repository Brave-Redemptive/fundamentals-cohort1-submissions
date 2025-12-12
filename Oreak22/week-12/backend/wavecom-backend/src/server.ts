import app from "./app";
import connectDB from "./config/db";
import dotenv from "dotenv";
import { connectRabbit } from "./config/rabbit";

dotenv.config();

const PORT = process.env.PORT || 4000;

const start = async () => {
  await connectDB();
  await connectRabbit();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

start();
