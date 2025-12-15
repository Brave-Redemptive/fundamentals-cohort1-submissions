/**
 * Stats Routes - Samuel Ajewole
 * Software Engineering Week 12 Challenge
 */

const express = require('express');
const notificationService = require('../services/notificationService');
const logger = require('../utils/logger');

const router = express.Router();

// Get system statistics
router.get('/', async (req, res) => {
  try {
    const stats = await notificationService.getSystemStats();
    
    res.json({
      success: true,
      stats: {
        ...stats,
        system: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          nodeVersion: process.version,
          author: 'Samuel Ajewole',
          studentId: 'PG/CSC/250006'
        }
      }
    });
  } catch (error) {
    logger.error('Get stats error:', error);
    res.status(500).json({
      error: 'Failed to get system statistics',
      message: error.message
    });
  }
});

// Get queue statistics
router.get('/queues', async (req, res) => {
  try {
    const queueService = require('../services/queueService');
    const queueStats = await queueService.getQueueStats();
    
    res.json({
      success: true,
      queues: queueStats
    });
  } catch (error) {
    logger.error('Get queue stats error:', error);
    res.status(500).json({
      error: 'Failed to get queue statistics',
      message: error.message
    });
  }
});

module.exports = router;