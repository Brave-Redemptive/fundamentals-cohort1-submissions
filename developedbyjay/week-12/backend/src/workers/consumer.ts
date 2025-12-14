import { Job } from "@/models/job.js";
import { sendMockNotification } from "@/providers/mock-provider";
import { getChannel } from "@/rabbitmq/connection";
import { connectToDatabase } from "@/lib/mongoose.js";

const consume = async () => {
  await connectToDatabase();
  const channel = await getChannel();
  await channel.assertQueue("notifications");

  channel.consume("notifications", async (msg) => {
    if (!msg) return;

    const { jobId } = JSON.parse(msg.content.toString());
    const job = await Job.findById(jobId);
    if (!job) return channel.ack(msg);

    try {
      job.status = "processing";
      await job.save();

      await sendMockNotification(job.type, job.payload);

      job.status = "sent";
      await job.save();
      channel.ack(msg);
    } catch (err: any) {
      job.attempts++;
      job.error = err.message;

      if (job.attempts >= 3) {
        job.status = "failed";
        await job.save();
        return channel.ack(msg);
      }

      await job.save();
      channel.nack(msg, false, true); // requeue
    }
  });
};

consume();
