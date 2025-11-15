import winston from 'winston';
import config from '../config';

const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'deployhub-api' },
  transports: [
    new winston.transports.Console({
      format: config.env === 'development' 
        ? winston.format.simple() 
        : winston.format.json()
    })
  ],
});

export default logger;