import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import fs from "fs";
import path from "path";
import taskRoutes from "../routes/task.routes";

const app = express();

const DATA_PATH =
  process.env.DATA_PATH || path.join(__dirname, "../data/tasks.json");
if (!fs.existsSync(DATA_PATH)) {
  fs.writeFileSync(DATA_PATH, JSON.stringify({ tasks: [] }, null, 2));
}
app.set("DATA_PATH", DATA_PATH);

app.use(cors());
app.use(helmet());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use("/api", taskRoutes);

app.get("/api/status", (req:Request, res:Response) => {
  res.status(200).json({
    service: "syncforge-backend",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

app.use((req:Request, res:Response) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err: unknown, req:Request, res:Response) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong!" });
});

export default app;
