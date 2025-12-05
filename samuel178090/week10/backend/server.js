import app from './src/app.js';
import dotenv from 'dotenv';
import logger from './src/config/logger.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

function startServer() {
  const server = app.listen(PORT, () => {
    logger.info(`🚀 SyncForge API Server running on http://localhost:${PORT}`);
    logger.info(`📚 API Documentation: http://localhost:${PORT}/api`);
  });

  const graceful = (signal) => {
    logger.warn(`${signal} received: closing HTTP server`);
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => graceful('SIGTERM'));
  process.on('SIGINT', () => graceful('SIGINT'));

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', { reason, promise });
    try {
      server.close(() => process.exit(1));
    } catch (err) {
      process.exit(1);
    }
  });
}

startServer();
import app from './src/app.js';
import dotenv from 'dotenv';
import logger from './src/config/logger.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`🚀 SyncForge API Server running on http://localhost:${PORT}`);
  logger.info(`📚 API Documentation: http://localhost:${PORT}/api`);
});

// Graceful Shutdown
const shutdown = (signal) => {
  logger.warn(`${signal} received: closing HTTP server`);
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { reason, promise });
  // Safely shutdown
  try {
    server.close(() => process.exit(1));
  } catch (err) {
    process.exit(1);
  }
});

export default server;
import app from './src/app.js';
import dotenv from 'dotenv';
import logger from './src/config/logger.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`🚀 SyncForge API Server running on http://localhost:${PORT}`);
  logger.info(`📚 API Documentation: http://localhost:${PORT}/api`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  logger.warn('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.warn('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { reason, promise });
  // recommended: shutdown the server gracefully
  server.close(() => {
    process.exit(1);
  });
});
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('\n⚠️  SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n⚠️  SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

export default server;
