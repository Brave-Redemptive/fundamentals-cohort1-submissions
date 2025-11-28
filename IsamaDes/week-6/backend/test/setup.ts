// jest.mock("../src/lib/redis", () => ({
//   redis: {
//     get: jest.fn(),
//     set: jest.fn(),
//     del: jest.fn(),
//   },
// }));



// test/setup.ts
import redisClient from "../src/lib/redis";
import { prisma } from "../src/lib/prisma";

// Jest global setup/teardown
afterAll(async () => {
  // Close Redis connection safely
  if (redisClient) {
    try {
      await redisClient.quit();
      console.log("Redis connection closed.");
    } catch (err) {
      console.warn("Error closing Redis connection:", err);
    }
  }

  // Disconnect Prisma
  try {
    await prisma.$disconnect();
    console.log("Prisma disconnected.");
  } catch (err) {
    console.warn("Error disconnecting Prisma:", err);
  }
});

// Optional: reset timers and mocks after each test to prevent leaks
afterEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers();
});
