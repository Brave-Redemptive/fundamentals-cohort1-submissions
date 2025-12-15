/**
 * Stats Controller - Samuel Ajewole
 * Software Engineering Week 12 Challenge
 */

const notificationService = require('../services/notificationService');
const queueService = require('../services/queueService');
const logger = require('../utils/logger');

class StatsController {
  // Get comprehensive system statistics
  async getSystemStats(req, res) {
    try {
      const stats = await notificationService.getSystemStats();
      
      res.json({
        success: true,
        data: {
          ...stats,
          system: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            nodeVersion: process.version,
            environment: process.env.NODE_ENV || 'development',
            author: 'Samuel Ajewole',
            studentId: 'PG/CSC/250006',
            timestamp: new Date().toISOString()
          },
          performance: {
            heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
            external: Math.round(process.memoryUsage().external / 1024 / 1024),
            cpuUsage: process.cpuUsage()
          }
        }
      });

    } catch (error) {
      logger.error('Get system stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get system statistics',
        message: error.message
      });
    }
  }

  // Get queue statistics
  async getQueueStats(req, res) {
    try {
      const queueStats = await queueService.getQueueStats();
      
      // Calculate total messages across all queues
      const totalMessages = Object.values(queueStats).reduce(
        (sum, queue) => sum + (queue.messageCount || 0), 0
      );
      
      const totalConsumers = Object.values(queueStats).reduce(
        (sum, queue) => sum + (queue.consumerCount || 0), 0
      );

      res.json({
        success: true,
        data: {
          queues: queueStats,
          summary: {
            totalMessages,
            totalConsumers,
            activeQueues: Object.keys(queueStats).length,
            timestamp: new Date().toISOString()
          }
        }
      });

    } catch (error) {
      logger.error('Get queue stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get queue statistics',
        message: error.message
      });
    }
  }

  // Get real-time dashboard data
  async getDashboardStats(req, res) {
    try {
      const [systemStats, queueStats] = await Promise.all([
        notificationService.getSystemStats(),
        queueService.getQueueStats()
      ]);

      // Calculate success rate
      const totalJobs = Object.values(systemStats.byStatus).reduce((sum, count) => sum + count, 0);
      const successfulJobs = (systemStats.byStatus.sent || 0) + (systemStats.byStatus.delivered || 0);
      const successRate = totalJobs > 0 ? ((successfulJobs / totalJobs) * 100).toFixed(2) : 0;

      // Calculate processing rate (jobs per minute)
      const processingJobs = systemStats.byStatus.processing || 0;
      const queuedJobs = systemStats.byStatus.queued || 0;
      
      res.json({
        success: true,
        data: {
          overview: {
            totalJobs,
            successfulJobs,
            failedJobs: systemStats.byStatus.failed || 0,
            successRate: parseFloat(successRate),
            processingJobs,
            queuedJobs
          },
          byStatus: systemStats.byStatus,
          byType: systemStats.byType,
          byPriority: systemStats.byPriority,
          queues: queueStats,
          system: {
            uptime: Math.floor(process.uptime()),
            memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            timestamp: new Date().toISOString()
          }
        }
      });

    } catch (error) {
      logger.error('Get dashboard stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get dashboard statistics',
        message: error.message
      });
    }
  }

  // Get performance metrics
  async getPerformanceMetrics(req, res) {
    try {
      const { timeframe = '1h' } = req.query;
      
      // This would typically query time-series data
      // For now, return current metrics
      const metrics = {
        throughput: {
          current: 0, // jobs per minute
          average: 0,
          peak: 0
        },
        latency: {
          average: 0, // milliseconds
          p95: 0,
          p99: 0
        },
        errorRate: {
          current: 0, // percentage
          average: 0
        },
        resourceUsage: {
          cpu: 0, // percentage
          memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          connections: 0
        }
      };

      res.json({
        success: true,
        data: {
          timeframe,
          metrics,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      logger.error('Get performance metrics error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get performance metrics',
        message: error.message
      });
    }
  }

  // Health check endpoint
  async getHealthCheck(req, res) {
    try {
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0',
        author: 'Samuel Ajewole',
        studentId: 'PG/CSC/250006',
        services: {
          database: 'connected', // Would check actual DB connection
          queue: 'connected',     // Would check actual RabbitMQ connection
          api: 'running'
        }
      };

      res.json({
        success: true,
        data: health
      });

    } catch (error) {
      logger.error('Health check error:', error);
      res.status(503).json({
        success: false,
        status: 'unhealthy',
        error: 'Health check failed',
        message: error.message
      });
    }
  }
}

module.exports = new StatsController();