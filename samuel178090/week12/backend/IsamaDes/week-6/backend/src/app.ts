import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import { logger } from './utils/logger.js';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/authRoutes.js'
import txRoutes from './routes/transaction.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';
import rateLimitMiddleware from './middlewares/rateLimit.middleware.js';
import swaggerUi from "swagger-ui-express";
import swaggerDocs from './lib/swagger.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));

app.use(express.json()); // This is required to parse JSON bodies... was getting wrong input without it.... has to be before routes

app.use('/api', rateLimitMiddleware);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', txRoutes);

app.use((req, res) => res.status(404).json({ error: 'Not Found' }));
app.use(errorHandler);
export default app;
