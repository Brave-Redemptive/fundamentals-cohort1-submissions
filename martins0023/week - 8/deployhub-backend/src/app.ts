import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config';
import { requestLogger } from './middleware/requestLogger';
import { metricsMiddleware } from './middleware/metricsMiddleware';
import { errorHandler } from './middleware/errorHandler';
import healthRoutes from './routes/health';
import exampleRoutes from './routes/example';

const app: Application = express();

// Security & Parsing
app.use(helmet());
app.use(cors({ origin: config.allowedOrigins }));
app.use(express.json());

// Observability Middleware
app.use(metricsMiddleware);
app.use(requestLogger);

// Routes
app.use('/', healthRoutes);
app.use('/api/v1/example', exampleRoutes);

// Error Handling
app.use(errorHandler);

export default app;