import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/db";
import patientRoutes from "./routes/patientRoutes";
import doctorRoutes from "./routes/doctorRoutes"
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";

import {
  notFound,
  errorHandler,
} from "./middlewares/errorMiddleware";

const app = express();

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
    origin: ["https://pulsetracker-frontend.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => res.send("API is running"));
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/patient", patientRoutes);
app.use("/doctorRoutes", doctorRoutes);

app.use(errorHandler);
app.use(notFound);

export default app;
