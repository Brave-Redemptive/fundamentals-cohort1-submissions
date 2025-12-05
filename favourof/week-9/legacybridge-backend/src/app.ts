import express, { Application } from "express";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

const app: Application = express();

app.use(express.json());
import cors from "cors";

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://api-egacybridge-frontend.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Register routes
app.get("/health-check", (req, res) => {
  res.status(200).json({ message: "leagacybridge is now running" });
});

app.use("/api", routes);
app.use(errorHandler);

export default app;
