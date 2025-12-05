// import request from "supertest";
// import app from "../src/app";

// describe("Tasks API", () => {
//   let token: string;

//   beforeAll(async () => {
//     const email = `tasks${Date.now()}@mail.com`;
//     const password = "password123";

//     await request(app).post("/auth/register").send({
//       name: "Task User",
//       email,
//       password,
//     });

//     const loginRes = await request(app)
//       .post("/auth/login")
//       .send({ email, password });

//     token = loginRes.body.token;
//   });

//   it("should reject access without token", async () => {
//     const res = await request(app).get("/tasks");

//     expect(res.status).toBe(401);
//     expect(res.body).toHaveProperty("message");
//   });

//   it("should allow access to protected route with token", async () => {
//     const res = await request(app)
//       .get("/tasks")
//       .set("Authorization", `Bearer ${token}`);

//     expect(res.status).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//   });

//   it("should create a task", async () => {
//     const res = await request(app)
//       .post("/tasks")
//       .set("Authorization", `Bearer ${token}`)
//       .send({ title: "New Task" });

//     expect(res.status).toBe(201);
//     expect(res.body).toHaveProperty("title", "New Task");
//   });
// });
