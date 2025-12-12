import { Router, Request, Response } from 'express';
import NotificationJob from '../models/NotificationJob';
import NotificationLog from '../models/NotificationLog';
import { publishToQueue } from '../services/queueService';
import { NotificationPayload } from '../types/notification';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { type, recipient, subject, message, metadata }: NotificationPayload = req.body;
    
    if (!type || !recipient || !message) {
      return res.status(400).json({ error: 'Missing required fields: type, recipient, message' });
    }
    
    if (!['email', 'sms', 'push'].includes(type)) {
      return res.status(400).json({ error: 'Invalid notification type' });
    }
    
    const job = await NotificationJob.create({
      type,
      recipient,
      subject,
      message,
      metadata,
      status: 'pending'
    });
    
    await NotificationLog.create({
      jobId: job._id.toString(),
      status: 'pending',
      message: 'Job created'
    });
    
    await publishToQueue(job._id.toString());
    
    res.status(201).json({
      jobId: job._id,
      status: job.status,
      message: 'Notification job created and queued'
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification job' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const job = await NotificationJob.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    const logs = await NotificationLog.find({ jobId: req.params.id }).sort({ timestamp: -1 });
    
    res.json({
      jobId: job._id,
      type: job.type,
      recipient: job.recipient,
      status: job.status,
      retryCount: job.retryCount,
      createdAt: job.createdAt,
      sentAt: job.sentAt,
      error: job.error,
      logs
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [jobs, total] = await Promise.all([
      NotificationJob.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      NotificationJob.countDocuments(filter)
    ]);
    
    res.json({
      jobs: jobs.map(job => ({
        jobId: job._id,
        type: job.type,
        recipient: job.recipient,
        status: job.status,
        retryCount: job.retryCount,
        createdAt: job.createdAt,
        sentAt: job.sentAt
      })),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

router.get('/stats/summary', async (_req: Request, res: Response) => {
  try {
    const stats = await NotificationJob.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const summary = {
      pending: 0,
      queued: 0,
      processing: 0,
      sent: 0,
      failed: 0
    };
    
    stats.forEach(s => {
      summary[s._id as keyof typeof summary] = s.count;
    });
    
    res.json(summary);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
