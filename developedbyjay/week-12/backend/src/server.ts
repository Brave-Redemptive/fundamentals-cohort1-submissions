import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import jobsRouter from "./routes/jobs.routes.js";

import { connectToDatabase } from "./lib/mongoose.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100,
//   })
// );
app.use("/api/jobs", jobsRouter);

const PORT = process.env.PORT || 3000;

(async function startServer() {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
