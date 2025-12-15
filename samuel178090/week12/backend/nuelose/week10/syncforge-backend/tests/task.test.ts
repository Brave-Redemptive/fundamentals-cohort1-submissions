import request from "supertest";
import app from "../src/config/app.config";
import fs from "fs";
import path from "path";

describe("Task API Endpoints", () => {
  const TEST_TASKS_PATH = path.join(__dirname, "../src/data/tasks.test.json");

  const seedTasks = () => {
    const data = {
      tasks: [
        { id: "1", message: "First task", createdAt: new Date().toISOString() },
        {
          id: "2",
          message: "Second task",
          createdAt: new Date().toISOString(),
        },
      ],
    };

    fs.writeFileSync(TEST_TASKS_PATH, JSON.stringify(data, null, 2));
  };

  describe("GET /api/tasks", () => {
    it("should return all tasks with success envelope", async () => {
      seedTasks();

      const res = await request(app).get("/api/tasks").expect(200);

      expect(res.body).toEqual({
        success: true,
        count: 2,
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            message: expect.any(String),
            createdAt: expect.any(String),
          }),
        ]),
      });
    });

    it("should return empty array when no tasks", async () => {
      const res = await request(app).get("/api/tasks").expect(200);
      expect(res.body).toEqual({
        success: true,
        count: 0,
        data: [],
      });
    });
  });

  describe("POST /api/tasks", () => {
    it("should create a new task successfully", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .send({ message: "Learn TypeScript" })
        .expect(201);

      expect(res.body).toMatchObject({
        success: true,
        message: "Task created successfully",
        data: {
          id: expect.any(String),
          message: "Learn TypeScript",
          createdAt: expect.any(String),
        },
      });
    });

    it("should reject message shorter than 3 chars", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .send({ message: "hi" })
        .expect(400);

      expect(res.body).toMatchObject({
        success: false,
        error: "Validation failed",
        details: expect.arrayContaining([
          expect.objectContaining({
            field: "message",
            message: "Message must be at least 3 characters long",
          }),
        ]),
      });
    });

    it("should reject duplicate message (exact match)", async () => {
      await request(app)
        .post("/api/tasks")
        .send({ message: "Deploy to production" })
        .expect(201);

      const res = await request(app)
        .post("/api/tasks")
        .send({ message: "Deploy to production" })
        .expect(409);

      expect(res.body).toMatchObject({
        success: false,
        error: "Duplicate task",
        message: "A task with this exact message already exists",
        code: "DUPLICATE_MESSAGE",
      });
    });

    it("should require message field", async () => {
      const res = await request(app).post("/api/tasks").send({}).expect(400);

      expect(res.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: "message",
            message: "Message is required",
          }),
        ])
      );
    });
  });
});
