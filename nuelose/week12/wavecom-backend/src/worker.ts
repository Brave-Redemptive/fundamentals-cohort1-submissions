import amqplib from "amqplib";
import mongoose from "mongoose";
import NotificationJob, { INotificationJob } from "./models/notificationJob.models";

// Mock providers (20% failure rate)
const sendEmailMock = async (to: string, payload: any): Promise<boolean> => {
  await new Promise((r) => setTimeout(r, 300));
  return Math.random() > 0.2; // 80% success
};

const sendSMSMock = async (to: string, payload: any): Promise<boolean> => {
  await new Promise((r) => setTimeout(r, 400));
  return Math.random() > 0.2;
};

const sendPushMock = async (to: string, payload: any): Promise<boolean> => {
  await new Promise((r) => setTimeout(r, 200));
  return Math.random() > 0.2;
};

const providers = {
  email: sendEmailMock,
  sms: sendSMSMock,
  push: sendPushMock,
};

let channel: amqplib.Channel;

const connect = async () => {
  const conn = await amqplib.connect(
    process.env.RABBITMQ_URL || "amqp://rabbitmq:5672"
  );
  channel = await conn.createChannel();


  console.log("Worker connected — consuming from 'notifications' queue...");

  // Fair dispatch + only 1 message at a time per worker
  channel.prefetch(1);

  channel.consume("notifications", async (msg) => {
    if (!msg) return;

    try {
      const { jobId, attempt = 0 } = JSON.parse(msg.content.toString());
      const maxRetries = 5;

      const job = await NotificationJob.findById(jobId);
      if (!job) {
        channel.nack(msg, false, false);
        return;
      }

      job.status = "processing";
      job.attempts = attempt + 1;
      await job.save();

      console.log(
        `Processing job ${jobId} (attempt ${job.attempts}) — ${job.type} → ${job.to}`
      );

      const provider = providers[job.type];
      const success = await provider(job.to, job.payload);

      if (success) {
        job.status = "sent";
        await job.save();
        channel.ack(msg);
        console.log(`SUCCESS: Job ${jobId} delivered`);
      } else {
        // Failed this attempt
        if (job.attempts >= maxRetries) {
          job.status = "failed";
          job.error = "Max retries exceeded";
          await job.save();

          // Send to DLQ
          channel.sendToQueue("dlq", msg.content, {
            headers: { "x-retry-count": job.attempts },
            persistent: true,
          });

          channel.ack(msg);
          console.log(`FAILED PERMANENTLY: Job ${jobId} → moved to DLQ`);
        } else {
          // Retry with exponential backoff
          const delayMs = Math.pow(2, job.attempts) * 1000; // 1s, 2s, 4s, 8s, 16s

          setTimeout(() => {
            channel.sendToQueue("notifications", msg.content, {
              persistent: true,
            });
            channel.ack(msg);
          }, delayMs);

          console.log(`Retrying job ${jobId} in ${delayMs / 1000}s...`);
        }
      }
    } catch (err: any) {
      console.error("Worker error:", err.message);
      channel.nack(msg, false, true); // requeue
    }
  });
};

// Connect to DB and RabbitMQ
mongoose
  .connect(process.env.MONGO_URI || "mongodb://mongo:27017/wavecom")
  .then(() => {
    console.log("Worker → MongoDB Connected");
    connect();
  })
  .catch((err) => {
    console.error("Worker → MongoDB failed:", err.message);
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down worker...");
  if (channel) await channel.close();
  await mongoose.disconnect();
  process.exit(0);
});
