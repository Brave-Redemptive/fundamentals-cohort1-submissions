import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app";
import dotenv from "dotenv";
dotenv.config();

describe("Auth API", () => {
  const user = {
    name: "TestUser",
    email: `tests${Date.now()}@examples.com`,
    password: "123456",
  };

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI as string);
  }, 20000);
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should register a user successfully", async () => {
    const res = await request(app).post("/api/auth/register").send(user);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "Registration successfully");
  });

  it("should login a user and return a token", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: user.email,
      password: user.password,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should reject login with wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: user.email,
      password: "wrong",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Invalid credentials");
  });
});
