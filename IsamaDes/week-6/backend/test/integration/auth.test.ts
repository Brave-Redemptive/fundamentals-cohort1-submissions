import dotenv from "dotenv";
dotenv.config();

import request from "supertest";
import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";
import app from "../../src/app"; 

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

describe("Auth Integration Tests", () => {
  beforeAll(async () => {
    // Clean test DB before running tests
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
    redis.disconnect();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email: "test@example.com",
          password: "password123",
          role: "CLIENT", 
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("is", "success");
      expect(res.body.value).toHaveProperty("email", "test@example.com")

      // Confirm in database
      const user = await prisma.user.findUnique({
        where: { email: "test@example.com" },
      });
      expect(user).not.toBeNull();
    });

     it("should NOT register a user if email already exists", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
          name: "Test User",
          email: "test@example.com",
          password: "password123",
          role: "CLIENT",
        });

       expect(res.status).toBe(400);
  expect(res.body).toHaveProperty("message", "User already exists");
  });
  });

  describe("POST /api/auth/login", () => {
    it("should login a user", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "password123",
        });

      expect(res.status).toBe(200);

      // If JWT is set in cookies instead of response body:
      const cookies = res.headers['set-cookie'];
      expect(cookies).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/^accessToken=/),
          expect.stringMatching(/^refreshToken=/),
        ])
      );
    });

    it("should reject invalid credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "wrongpassword",
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message", "Invalid credentials");
    });
  });
});
