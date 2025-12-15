import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import UserRoutes from "./routes/UserRoutes.js"
import {
  notFound,
  errorHandler,
} from "./middleware/errorMiddleware.js";
dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cors({ 
   origin: ["https://devconnect-frontend-three.vercel.app", "http://localhost:5173"],
   credentials: true }));

app.use(express.json());
app.use(cookieParser());

app.get("/", (_, res) => res.send("DevConnect API Running ✅"));

app.use("/auth", authRoutes);
app.use("/user", UserRoutes)
app.use("/projects", projectRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
