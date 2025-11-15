import dotenv from 'dotenv';
dotenv.config();

interface Config {
  port: number;
  env: string;
  logLevel: string;
  allowedOrigins: string[];
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  env: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['*']
};

export default config;