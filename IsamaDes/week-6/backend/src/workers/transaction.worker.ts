// API stays fast — it only enqueues jobs.
// Worker handles processing in background.
// If server restarts, Redis queue persists jobs.
// You can scale workers horizontally.
import { Worker } from "bullmq";
import redis from "../lib/redis.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const worker = new Worker(
  "transactions",
  async job => {
    const { id } = job.data;
    console.log(`Processing transaction ${id}`);

    // simulate delay
    await new Promise(r => setTimeout(r, 1000));

    await prisma.transaction.update({
      where: { id },
      data: { status: "SUCCESS" },
    });

    console.log(`Transaction ${id} marked as SUCCESS`);
  },
  { connection: redis }
);
