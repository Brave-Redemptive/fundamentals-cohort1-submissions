import express, { Application, Request, Response } from "express";
import cors from "cors";
import taskRoutes from "./routes/task.routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

//create and configure the express app

export const createApp = (): Application => {
  const app = express();

  //middlewares

  //enable cors
  app.use(
    cors({
      origin: ["http://localhost:5174", "http://127.0.0.1:5173"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  //json body parser
  app.use(express.json());

  //parse url-encoded bodies
  app.use(express.urlencoded({ extended: true }));

  //health check endpoint
  app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
      message: "SyncForge Backend API is running!",
      timestamp: new Date().toISOString(),
      endpoints: {
        health: "/",
        tasks: "/api/tasks",
      },
    });
  });

  // API Routes
  app.use("/api/tasks", taskRoutes);

  // 404 Handler - Must come AFTER all routes
  app.use(notFoundHandler);

  // Global Error Handler - Must be LAST middleware
  app.use(errorHandler);

  return app;
};
