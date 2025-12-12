// src/worker/consumer.ts
import Log from "../models/NotificationLog";
import amqp from "amqplib";
import { notificationChannels, notificationStatus } from "../utils/enums";
import { consumeQueue } from "../services/rabbitmq";
import { channel } from "diagnostics_channel";
import NotificationJob from "../models/NotificationJob";

const CHANNELS = ["sms", "email", "push"];

export const startWorker = async () => {

  console.log("Worker started. Listening on queues...");

  const jobs = await NotificationJob.find({status: notificationStatus.queued});

  for (const job of jobs) {
    await consumeQueue(job.channel, async (msg) => {
      if (!msg) return;

      const jobId = msg._id;
      await Log.create({
        notificationJobId : jobId,
        event: "worker-started",
        status: notificationStatus.processing,
        channel: job.channel
      });

      await NotificationJob.findByIdAndUpdate(jobId, { status: notificationStatus.processing });

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        await NotificationJob.findByIdAndUpdate(jobId, { status: "success" });

        await Log.create({
         notificationJobId : jobId,
          event: "job-completed",
          status: notificationStatus.success,
          channel: job.channel
        });

      } catch (err: any) {
        if (job.retryCount < 3){
          await NotificationJob.findByIdAndUpdate(jobId, { status: notificationStatus.queued, retryCount: job.retryCount + 1 });

        }
        else{
          await NotificationJob.findByIdAndUpdate(jobId, { status: notificationStatus.failed });
        }
        await Log.create({
          notificationJobId : jobId,
          event: "job-error",
          status: notificationStatus.failed,
          channel: job.channel
        });
      }
    });
  }
};

const handleConsumeQueue = () => {
    
}


