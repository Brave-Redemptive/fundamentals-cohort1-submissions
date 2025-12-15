// src/config/env.config.ts

import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

/**
 * Environment configuration
 * Centralized place for all environment variables
 */
export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
};

/**
 * Validate required environment variables
 */
export const validateEnv = (): void => {
  const requiredEnvVars = ["PORT"];

  const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missingVars.length > 0) {
    console.warn(
      `⚠️  Warning: Missing environment variables: ${missingVars.join(", ")}`
    );
  }
};
