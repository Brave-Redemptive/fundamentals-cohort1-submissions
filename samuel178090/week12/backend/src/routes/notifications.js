/**
 * Notification Routes - Samuel Ajewole
 * Software Engineering Week 12 Challenge
 */

const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const notificationService = require('../services/notificationService');
const logger = require('../utils/logger');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Create notification job
router.post('/', [
  body('type').isIn(['email', 'sms', 'push']).withMessage('Type must be email, sms, or push'),
  body('recipient').notEmpty().withMessage('Recipient is required'),
  body('message').notEmpty().withMessage('Message is required'),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('clientId').optional().isString(),
  handleValidationErrors
], async (req, res) => {
  try {
    const { type, recipient, subject, message, priority, clientId, scheduledAt, metadata } = req.body;
    
    const job = await notificationService.createJob(
      clientId || 'default-client',
      type,
      recipient,
      message,
      { subject, priority, scheduledAt, metadata }
    );

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('jobCreated', {
      jobId: job.jobId,
      status: job.status,
      type: job.type,
      priority: job.priority
    });

    res.status(201).json({
      success: true,
      jobId: job.jobId,
      status: job.status,
      message: 'Notification job created successfully'
    });

    logger.info(`Job created: ${job.jobId} for ${recipient}`);
  } catch (error) {
    logger.error('Create job error:', error);
    res.status(500).json({
      error: 'Failed to create notification job',
      message: error.message
    });
  }
});

// Get job status
router.get('/:jobId', [
  param('jobId').isUUID().withMessage('Invalid job ID format'),
  handleValidationErrors
], async (req, res) => {
  try {
    const job = await notificationService.getJobStatus(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({
        error: 'Job not found'
      });
    }

    res.json({
      success: true,
      job: {
        jobId: job.jobId,
        type: job.type,
        recipient: job.recipient,
        subject: job.subject,
        message: job.message,
        status: job.status,
        priority: job.priority,
        attempts: job.attempts,
        createdAt: job.createdAt,
        processedAt: job.processedAt,
        sentAt: job.sentAt,
        deliveredAt: job.deliveredAt
      }
    });
  } catch (error) {
    logger.error('Get job status error:', error);
    res.status(500).json({
      error: 'Failed to get job status',
      message: error.message
    });
  }
});

// Get job logs
router.get('/:jobId/logs', [
  param('jobId').isUUID().withMessage('Invalid job ID format'),
  handleValidationErrors
], async (req, res) => {
  try {
    const logs = await notificationService.getJobLogs(req.params.jobId);
    
    res.json({
      success: true,
      logs
    });
  } catch (error) {
    logger.error('Get job logs error:', error);
    res.status(500).json({
      error: 'Failed to get job logs',
      message: error.message
    });
  }
});

// Get all jobs (paginated)
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['pending', 'queued', 'processing', 'sent', 'delivered', 'failed']),
  query('clientId').optional().isString(),
  handleValidationErrors
], async (req, res) => {
  try {
    const { page = 1, limit = 20, status, clientId } = req.query;
    
    let result;
    if (clientId) {
      result = await notificationService.getJobsByClient(clientId, parseInt(page), parseInt(limit), status);
    } else {
      result = await notificationService.getAllJobs(parseInt(page), parseInt(limit), status);
    }

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    logger.error('Get jobs error:', error);
    res.status(500).json({
      error: 'Failed to get jobs',
      message: error.message
    });
  }
});

// Update job status (internal use)
router.patch('/:jobId/status', [
  param('jobId').isUUID().withMessage('Invalid job ID format'),
  body('status').isIn(['pending', 'queued', 'processing', 'sent', 'delivered', 'failed']),
  handleValidationErrors
], async (req, res) => {
  try {
    const { status, message, metadata } = req.body;
    
    const job = await notificationService.updateJobStatus(
      req.params.jobId,
      status,
      message,
      metadata
    );

    if (!job) {
      return res.status(404).json({
        error: 'Job not found'
      });
    }

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('jobStatusUpdate', {
      jobId: job.jobId,
      status: job.status,
      updatedAt: new Date()
    });

    res.json({
      success: true,
      job: {
        jobId: job.jobId,
        status: job.status,
        updatedAt: job.updatedAt
      }
    });
  } catch (error) {
    logger.error('Update job status error:', error);
    res.status(500).json({
      error: 'Failed to update job status',
      message: error.message
    });
  }
});

module.exports = router;