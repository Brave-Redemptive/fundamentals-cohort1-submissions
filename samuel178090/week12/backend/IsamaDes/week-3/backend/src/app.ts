import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import {
  notFound,
  errorHandler,
  badRequest,
  invalidCredentials,
} from"./middleware/errorMiddleware.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec  from "./config/swagger.js";

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "img-src": ["'self'", "data:", "https:"],
        "script-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        "style-src": [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
        ],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: [
      "https://todo-frontend-rosy-five.vercel.app",
      "http://localhost:3000",
      "http://localhost:5000",
    ],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (_req: Request, res: Response) => res.send("API is running"));
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/client", clientRoutes);


app.use(errorHandler);
app.use(badRequest);
app.use(invalidCredentials);
app.use(notFound);

export default app;
