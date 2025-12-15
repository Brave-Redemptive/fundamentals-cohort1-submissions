/**
 * Notification Service - Samuel Ajewole
 * Software Engineering Week 12 Challenge
 */

const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

// Use mock database in demo mode
let db, queueService;
if (process.env.DEMO_MODE === 'true') {
  db = require('./mockDatabase');
  queueService = { 
    publishJob: () => Promise.resolve(), 
    getQueueStats: () => ({ 
      high: { messageCount: 0, consumerCount: 1 }, 
      medium: { messageCount: 0, consumerCount: 1 }, 
      low: { messageCount: 0, consumerCount: 1 } 
    }) 
  };
} else {
  const NotificationJob = require('../models/NotificationJob');
  const NotificationLog = require('../models/NotificationLog');
  queueService = require('./queueService');
}

class NotificationService {
  async createJob(clientId, type, recipient, message, options = {}) {
    const jobId = uuidv4();
    
    const jobData = {
      jobId,
      clientId,
      type,
      recipient,
      subject: options.subject,
      message,
      priority: options.priority || 'medium',
      maxAttempts: options.maxAttempts || 5,
      scheduledAt: options.scheduledAt || new Date(),
      metadata: options.metadata || {},
      status: 'pending'
    };

    const job = process.env.DEMO_MODE === 'true' 
      ? await db.createJob(jobData)
      : await new NotificationJob(jobData).save();
    
    // Log creation
    await this.logEvent(jobId, clientId, 'created', 'Notification job created');
    
    // Queue the job
    await queueService.publishJob(job);
    
    // Update to queued status
    const queuedJob = await this.updateJobStatus(jobId, 'queued', 'Job queued for processing');
    
    logger.info(`Notification job created: ${jobId} for ${recipient}`);
    return queuedJob || job;
  }

  async updateJobStatus(jobId, status, message = null, metadata = {}) {
    const updateData = { status };
    
    if (status === 'processing') {
      updateData.processedAt = new Date();
    } else if (status === 'sent') {
      updateData.sentAt = new Date();
    } else if (status === 'delivered') {
      updateData.deliveredAt = new Date();
    }

    const job = process.env.DEMO_MODE === 'true'
      ? await db.updateJob(jobId, { ...updateData, ...metadata })
      : await NotificationJob.findOneAndUpdate({ jobId }, { ...updateData, ...metadata }, { new: true });

    if (job) {
      await this.logEvent(jobId, job.clientId, status, message);
    }

    return job;
  }

  async getJobStatus(jobId) {
    return process.env.DEMO_MODE === 'true'
      ? await db.findJobByJobId(jobId)
      : await NotificationJob.findOne({ jobId }).select('-errorHistory');
  }

  async getJobsByClient(clientId, page = 1, limit = 20, status = null) {
    return process.env.DEMO_MODE === 'true'
      ? await db.getJobsByClient(clientId, page, limit, status)
      : await this._getJobsByClientMongo(clientId, page, limit, status);
  }

  async getAllJobs(page = 1, limit = 20, status = null) {
    return process.env.DEMO_MODE === 'true'
      ? await db.getAllJobs(page, limit, status)
      : await this._getAllJobsMongo(page, limit, status);
  }

  async getSystemStats() {
    return process.env.DEMO_MODE === 'true'
      ? await db.getSystemStats()
      : await this._getSystemStatsMongo();
  }

  async logEvent(jobId, clientId, event, message, metadata = {}) {
    if (process.env.DEMO_MODE === 'true') {
      await db.createLog({ jobId, clientId, event, message, metadata });
    } else {
      const log = new NotificationLog({ jobId, clientId, event, message, metadata });
      await log.save();
    }
  }

  async getJobLogs(jobId) {
    return process.env.DEMO_MODE === 'true'
      ? await db.getJobLogs(jobId)
      : await NotificationLog.find({ jobId }).sort({ timestamp: 1 });
  }

  // MongoDB methods (when not in demo mode)
  async _getJobsByClientMongo(clientId, page, limit, status) {
    const query = { clientId };
    if (status) query.status = status;
    const skip = (page - 1) * limit;
    
    const jobs = await NotificationJob.find(query)
      .select('-errorHistory')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await NotificationJob.countDocuments(query);
    return { jobs, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  async _getAllJobsMongo(page, limit, status) {
    const query = {};
    if (status) query.status = status;
    const skip = (page - 1) * limit;
    
    const jobs = await NotificationJob.find(query)
      .select('-errorHistory')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await NotificationJob.countDocuments(query);
    return { jobs, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  async _getSystemStatsMongo() {
    const stats = await NotificationJob.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    const typeStats = await NotificationJob.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]);
    const priorityStats = await NotificationJob.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]);
    const queueStats = await queueService.getQueueStats();

    return {
      byStatus: stats.reduce((acc, stat) => ({ ...acc, [stat._id]: stat.count }), {}),
      byType: typeStats.reduce((acc, stat) => ({ ...acc, [stat._id]: stat.count }), {}),
      byPriority: priorityStats.reduce((acc, stat) => ({ ...acc, [stat._id]: stat.count }), {}),
      queues: queueStats,
      timestamp: new Date()
    };
  }
}

module.exports = new NotificationService();