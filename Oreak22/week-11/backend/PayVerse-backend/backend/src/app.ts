import express from "express";
import cors from "cors";
import paymentsRoutes from "./routes/payments.routes";
import sseRoutes from "./routes/sse.routes";
import dotenv from "dotenv";

dotenv.config();
export const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/payments", paymentsRoutes);
app.use("/api/events", sseRoutes);

export default app;
