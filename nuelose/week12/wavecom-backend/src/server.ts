import express, {Request, Response} from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectRabbitMQ } from "./config/rabbitmq";
import { connectDB } from "./config/db";
import notificationRoutes from "./routes/notification.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("WaveCom Notification System API Running");
});
app.use("/api/notifications", notificationRoutes);
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err: unknown, req: Request, res: Response) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong!" });
});


const start = async () => {
  try {
    await connectRabbitMQ();

    await connectDB();

    const PORT =  5000;
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();
