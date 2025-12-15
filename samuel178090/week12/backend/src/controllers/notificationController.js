/**
 * Notification Controller - Samuel Ajewole
 * Software Engineering Week 12 Challenge
 */

const notificationService = require('../services/notificationService');
const logger = require('../utils/logger');

class NotificationController {
  // Create new notification job
  async createNotification(req, res) {
    try {
      const { type, recipient, subject, message, priority, clientId, scheduledAt, metadata } = req.body;
      
      const job = await notificationService.createJob(
        clientId || req.user?.userId || 'anonymous',
        type,
        recipient,
        message,
        { subject, priority, scheduledAt, metadata }
      );

      // Emit real-time update
      const io = req.app.get('io');
      if (io) {
        io.emit('jobCreated', {
          jobId: job.jobId,
          status: job.status,
          type: job.type,
          priority: job.priority,
          createdAt: job.createdAt
        });
      }

      res.status(201).json({
        success: true,
        data: {
          jobId: job.jobId,
          status: job.status,
          type: job.type,
          priority: job.priority,
          createdAt: job.createdAt
        },
        message: 'Notification job created successfully'
      });

      logger.info(`Notification created: ${job.jobId}`, {
        type: job.type,
        recipient: job.recipient,
        priority: job.priority,
        userId: req.user?.userId
      });

    } catch (error) {
      logger.error('Create notification error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create notification job',
        message: error.message
      });
    }
  }

  // Get job status by ID
  async getJobStatus(req, res) {
    try {
      const { jobId } = req.params;
      const job = await notificationService.getJobStatus(jobId);
      
      if (!job) {
        return res.status(404).json({
          success: false,
          error: 'Job not found',
          message: `No job found with ID: ${jobId}`
        });
      }

      res.json({
        success: true,
        data: {
          jobId: job.jobId,
          type: job.type,
          recipient: job.recipient,
          subject: job.subject,
          message: job.message,
          status: job.status,
          priority: job.priority,
          attempts: job.attempts,
          maxAttempts: job.maxAttempts,
          createdAt: job.createdAt,
          processedAt: job.processedAt,
          sentAt: job.sentAt,
          deliveredAt: job.deliveredAt,
          lastError: job.lastError
        }
      });

    } catch (error) {
      logger.error('Get job status error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get job status',
        message: error.message
      });
    }
  }

  // Get job logs
  async getJobLogs(req, res) {
    try {
      const { jobId } = req.params;
      const logs = await notificationService.getJobLogs(jobId);
      
      res.json({
        success: true,
        data: logs,
        count: logs.length
      });

    } catch (error) {
      logger.error('Get job logs error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get job logs',
        message: error.message
      });
    }
  }

  // Get all jobs with pagination
  async getAllJobs(req, res) {
    try {
      const { page = 1, limit = 20, status, clientId } = req.query;
      
      let result;
      if (clientId) {
        result = await notificationService.getJobsByClient(
          clientId, 
          parseInt(page), 
          parseInt(limit), 
          status
        );
      } else {
        result = await notificationService.getAllJobs(
          parseInt(page), 
          parseInt(limit), 
          status
        );
      }

      res.json({
        success: true,
        data: result.jobs,
        pagination: result.pagination,
        filters: { status, clientId }
      });

    } catch (error) {
      logger.error('Get all jobs error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get jobs',
        message: error.message
      });
    }
  }

  // Update job status (internal use)
  async updateJobStatus(req, res) {
    try {
      const { jobId } = req.params;
      const { status, message, metadata } = req.body;
      
      const job = await notificationService.updateJobStatus(
        jobId,
        status,
        message,
        metadata
      );

      if (!job) {
        return res.status(404).json({
          success: false,
          error: 'Job not found'
        });
      }

      // Emit real-time update
      const io = req.app.get('io');
      if (io) {
        io.emit('jobStatusUpdate', {
          jobId: job.jobId,
          status: job.status,
          updatedAt: new Date()
        });
      }

      res.json({
        success: true,
        data: {
          jobId: job.jobId,
          status: job.status,
          updatedAt: job.updatedAt
        },
        message: 'Job status updated successfully'
      });

    } catch (error) {
      logger.error('Update job status error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update job status',
        message: error.message
      });
    }
  }

  // Retry failed job
  async retryJob(req, res) {
    try {
      const { jobId } = req.params;
      const job = await notificationService.getJobStatus(jobId);
      
      if (!job) {
        return res.status(404).json({
          success: false,
          error: 'Job not found'
        });
      }

      if (job.status !== 'failed') {
        return res.status(400).json({
          success: false,
          error: 'Job is not in failed state',
          message: 'Only failed jobs can be retried'
        });
      }

      // Reset job for retry
      const updatedJob = await notificationService.updateJobStatus(
        jobId,
        'pending',
        'Job manually retried',
        { attempts: 0, lastError: null }
      );

      res.json({
        success: true,
        data: {
          jobId: updatedJob.jobId,
          status: updatedJob.status
        },
        message: 'Job queued for retry'
      });

    } catch (error) {
      logger.error('Retry job error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retry job',
        message: error.message
      });
    }
  }
}

module.exports = new NotificationController();