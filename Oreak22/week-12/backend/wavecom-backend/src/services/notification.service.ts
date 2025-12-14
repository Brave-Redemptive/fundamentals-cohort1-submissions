import NotificationJob from "../models/NotificationJob";
import { getChannel } from "../config/rabbit";

class NotificationService {
  async createJob(data: any) {
    const job = await NotificationJob.create(data);
    const channel = getChannel();
    channel.sendToQueue(
      process.env.QUEUE_NAME!,
      Buffer.from(JSON.stringify(job))
    );
    return job;
  }

  async getJob(id: string) {
    return NotificationJob.findById(id);
  }

  async listJobs() {
    return NotificationJob.find().sort({ createdAt: -1 });
  }
}

export default new NotificationService();
