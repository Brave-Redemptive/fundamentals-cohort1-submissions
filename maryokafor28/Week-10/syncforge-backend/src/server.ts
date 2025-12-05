// src/server.ts

import { createApp } from "./app";
import { config, validateEnv } from "./config/env.config";

/**
 * Start the Express server
 */
const startServer = (): void => {
  // Validate environment variables
  validateEnv();

  // Create Express app
  const app = createApp();

  // Start listening on the configured port
  app.listen(config.port, () => {
    console.log("=================================");
    console.log(`🚀 Server is running!`);
    console.log(`📡 Port: ${config.port}`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
    console.log(`🔗 URL: http://localhost:${config.port}`);
    console.log("=================================");
  });
};

// Start the server
startServer();
