import express from 'express';
import dotenv from 'dotenv';
import { corsMiddleware } from './middleware/cors.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import logger from './config/logger.js';
import tasksRouter from './routes/tasks.js';
import teamRouter from './routes/team.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'SyncForge API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API endpoints
app.use('/api/tasks', tasksRouter);
app.use('/api/team', teamRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server with graceful port conflict handling (tries next ports up to a limit)
const MAX_PORT_ATTEMPTS = 10;

function startServer(port, attempts = 0) {
  const server = app.listen(port, () => {
    logger.info(`🚀 SyncForge API Server running on http://localhost:${port}`);
    logger.info(`📚 API Documentation: http://localhost:${port}/api`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      if (attempts < MAX_PORT_ATTEMPTS) {
        const nextPort = Number(port) + 1;
        logger.warn(`Port ${port} is already in use — trying port ${nextPort} (attempt ${attempts + 1})`);
        // give a small delay before retrying to avoid rapid loops
        setTimeout(() => startServer(nextPort, attempts + 1), 200);
      } else {
        logger.error(`Unable to bind server after ${MAX_PORT_ATTEMPTS} attempts. Exiting.`);
        process.exit(1);
      }
    } else {
      logger.error('Server error:', err);
      process.exit(1);
    }
  });

  // Graceful shutdown
  const shutdown = () => {
    logger.info('Shutting down server...');
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startServer(PORT);
