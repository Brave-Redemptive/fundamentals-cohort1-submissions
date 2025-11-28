import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import authRoutes from "./routes/authRoutes";
import { NotFoundError } from "./errors";
import {
  errorHandler,
} from "./middleware/errorMiddleware";

const app = express();

if (process.env.NODE_ENV !== "test") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}


app.use((req, res, next) => {
  console.log("Origin:", req.headers.origin);
  next();
});

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
    origin: [ "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("API is running"));
app.use("/auth", authRoutes);

app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});
app.use(errorHandler);

export default app;
