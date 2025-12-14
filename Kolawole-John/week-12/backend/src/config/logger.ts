import winston from 'winston';
import path from 'path';

const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let metaString = '';
    if (Object.keys(meta).length > 0) {
      metaString = JSON.stringify(meta, null, 2);
    }
    return `${timestamp} [${level}]: ${message} ${metaString}`;
  })
);

const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  defaultMeta: { service: 'wavecom-notification-service' },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: consoleFormat
    }),
    // Error log file
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Combined log file
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ],
  // Handle exceptions and rejections
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: path.join('logs', 'exceptions.log') 
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({ 
      filename: path.join('logs', 'rejections.log') 
    })
  ]
});

// Create a stream object for Morgan HTTP logger
export const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  }
};

export { logger };