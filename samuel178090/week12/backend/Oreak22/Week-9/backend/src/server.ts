import express from "express";
import v2Routes from "./routes/v2.routes";
import { errorHandler } from "./middlewares/error.middleware";
import { versionMiddleware } from "./middlewares/version.middleware";
import pino from "pino-http";
import cors from "cors";

export function createServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(pino());

  app.use(versionMiddleware);

  app.use("/v2", v2Routes);

  app.use(errorHandler);

  return app;
}

export default createServer;
