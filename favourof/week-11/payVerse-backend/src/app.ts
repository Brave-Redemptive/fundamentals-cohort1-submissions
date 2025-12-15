import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/authRoute";
import transactionRoutes from "./routes/transactionRoutes";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

app.use("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "welcome to PayVerse" });
});

export default app;
