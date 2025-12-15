import request from "supertest";
import app from "../src/app";

describe("Error Handler", () => {
  it("should return ok", async () => {
    const res = await request(app).get("/api/health");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "ok");
  });
});
