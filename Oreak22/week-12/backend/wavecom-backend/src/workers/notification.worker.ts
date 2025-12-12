import dotenv from "dotenv";
dotenv.config();

import NotificationJob from "../models/NotificationJob";
import NotificationLog from "../models/NotificationLog";
import ProviderService from "../services/provider.service";
import { connectRabbit, getChannel } from "../config/rabbit";
import connectDB from "../config/db";

const provider = new ProviderService();

const startWorker = async () => {
  await connectDB();
  await connectRabbit();
  const channel = getChannel();
  const queue = process.env.QUEUE_NAME!;

  channel.consume(queue, async (msg) => {
    if (!msg) return;

    const job = JSON.parse(msg.content.toString());

    await NotificationJob.findByIdAndUpdate(job._id, { status: "processing" });

    try {
      switch (job.type) {
        case "email":
          await provider.sendEmail(job.payload);
          break;
        case "sms":
          await provider.sendSMS(job.payload);
          break;
        case "push":
          await provider.sendPush(job.payload);
          break;
      }

      await NotificationJob.findByIdAndUpdate(job._id, { status: "sent" });

      await NotificationLog.create({
        jobId: job._id,
        message: "Notification delivered",
      });

      channel.ack(msg);
    } catch (err) {
      await NotificationJob.findByIdAndUpdate(job._id, { status: "failed" });
      channel.ack(msg);
    }
  });
};

startWorker();
