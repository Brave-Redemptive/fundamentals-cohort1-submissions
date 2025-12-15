/**
 * Mock Database Service - Samuel Ajewole
 * Software Engineering Week 12 Challenge
 * For demo without Docker/MongoDB
 */

const { v4: uuidv4 } = require('uuid');

// In-memory storage for demo
let jobs = [
  {
    jobId: 'demo-job-1',
    clientId: 'samuel-client',
    type: 'email',
    recipient: 'josephsammy1994@gmail.com',
    subject: 'Welcome to WaveCom',
    message: 'Your notification system is working perfectly! This is a demo notification.',
    priority: 'high',
    status: 'delivered',
    attempts: 1,
    maxAttempts: 5,
    createdAt: new Date(Date.now() - 300000), // 5 minutes ago
    processedAt: new Date(Date.now() - 240000), // 4 minutes ago
    sentAt: new Date(Date.now() - 180000), // 3 minutes ago
    deliveredAt: new Date(Date.now() - 120000), // 2 minutes ago
    metadata: { author: 'Samuel Ajewole', studentId: 'PG/CSC/250006', demo: true }
  },
  {
    jobId: 'demo-job-2',
    clientId: 'samuel-client',
    type: 'sms',
    recipient: '+1234567890',
    message: 'SMS test from WaveCom system - working great!',
    priority: 'medium',
    status: 'sent',
    attempts: 1,
    maxAttempts: 5,
    createdAt: new Date(Date.now() - 600000), // 10 minutes ago
    processedAt: new Date(Date.now() - 540000), // 9 minutes ago
    sentAt: new Date(Date.now() - 480000), // 8 minutes ago
    metadata: { provider: 'mock-sms', demo: true }
  },
  {
    jobId: 'demo-job-3',
    clientId: 'demo-client',
    type: 'push',
    recipient: 'device-token-123',
    message: 'Push notification test - system is scalable!',
    priority: 'low',
    status: 'processing',
    attempts: 0,
    maxAttempts: 5,
    createdAt: new Date(Date.now() - 60000), // 1 minute ago
    processedAt: new Date(Date.now() - 30000), // 30 seconds ago
    metadata: { deviceType: 'mobile', platform: 'android', demo: true }
  }
];

let logs = [
  {
    jobId: 'demo-job-1',
    clientId: 'samuel-client',
    event: 'created',
    message: 'Demo notification created',
    timestamp: new Date(Date.now() - 300000),
    metadata: { demo: true }
  },
  {
    jobId: 'demo-job-1',
    clientId: 'samuel-client',
    event: 'queued',
    message: 'Job queued for processing',
    timestamp: new Date(Date.now() - 280000),
    metadata: { queue: 'high_priority' }
  },
  {
    jobId: 'demo-job-1',
    clientId: 'samuel-client',
    event: 'processing',
    message: 'Job is being processed',
    timestamp: new Date(Date.now() - 240000),
    metadata: { worker: 'worker-1' }
  },
  {
    jobId: 'demo-job-1',
    clientId: 'samuel-client',
    event: 'sent',
    message: 'Email sent successfully',
    timestamp: new Date(Date.now() - 180000),
    metadata: { provider: 'mock-email', messageId: 'msg_123' }
  },
  {
    jobId: 'demo-job-1',
    clientId: 'samuel-client',
    event: 'delivered',
    message: 'Email delivered successfully',
    timestamp: new Date(Date.now() - 120000),
    metadata: { deliveryTime: '2.5s' }
  }
];

class MockDatabase {
  // Jobs operations
  async createJob(jobData) {
    const job = {
      ...jobData,
      jobId: jobData.jobId || uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      attempts: jobData.attempts || 0,
      maxAttempts: jobData.maxAttempts || 5
    };
    jobs.unshift(job); // Add to beginning for newest first
    
    // Simulate job processing in demo mode
    setTimeout(() => this.simulateJobProcessing(job.jobId), 2000);
    
    return job;
  }

  async simulateJobProcessing(jobId) {
    // Update to processing
    await this.updateJob(jobId, { 
      status: 'processing', 
      processedAt: new Date(),
      attempts: 1 
    });
    
    // Simulate processing delay
    setTimeout(async () => {
      // 90% success rate
      if (Math.random() < 0.9) {
        await this.updateJob(jobId, { 
          status: 'sent', 
          sentAt: new Date() 
        });
        
        // Simulate delivery confirmation
        setTimeout(async () => {
          await this.updateJob(jobId, { 
            status: 'delivered', 
            deliveredAt: new Date() 
          });
        }, 3000);
      } else {
        await this.updateJob(jobId, { 
          status: 'failed', 
          lastError: 'Mock provider temporarily unavailable' 
        });
      }
    }, 3000);
  }

  async findJobByJobId(jobId) {
    return jobs.find(job => job.jobId === jobId);
  }

  async updateJob(jobId, updateData) {
    const index = jobs.findIndex(job => job.jobId === jobId);
    if (index !== -1) {
      jobs[index] = { ...jobs[index], ...updateData, updatedAt: new Date() };
      
      // Auto-create log entry for status changes
      if (updateData.status) {
        await this.createLog({
          jobId,
          clientId: jobs[index].clientId,
          event: updateData.status,
          message: `Job status updated to ${updateData.status}`,
          metadata: { auto: true, ...updateData }
        });
      }
      
      return jobs[index];
    }
    return null;
  }

  async getAllJobs(page = 1, limit = 20, status = null) {
    let filteredJobs = [...jobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    if (status) {
      filteredJobs = filteredJobs.filter(job => job.status === status);
    }
    
    const start = (page - 1) * limit;
    const paginatedJobs = filteredJobs.slice(start, start + limit);
    
    return {
      jobs: paginatedJobs,
      pagination: {
        page,
        limit,
        total: filteredJobs.length,
        pages: Math.ceil(filteredJobs.length / limit)
      }
    };
  }

  async getJobsByClient(clientId, page = 1, limit = 20, status = null) {
    let filteredJobs = jobs.filter(job => job.clientId === clientId)
                          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    if (status) {
      filteredJobs = filteredJobs.filter(job => job.status === status);
    }
    
    const start = (page - 1) * limit;
    const paginatedJobs = filteredJobs.slice(start, start + limit);
    
    return {
      jobs: paginatedJobs,
      pagination: {
        page,
        limit,
        total: filteredJobs.length,
        pages: Math.ceil(filteredJobs.length / limit)
      }
    };
  }

  async getSystemStats() {
    const statusCounts = {};
    const typeCounts = {};
    const priorityCounts = {};

    jobs.forEach(job => {
      statusCounts[job.status] = (statusCounts[job.status] || 0) + 1;
      typeCounts[job.type] = (typeCounts[job.type] || 0) + 1;
      priorityCounts[job.priority] = (priorityCounts[job.priority] || 0) + 1;
    });

    return {
      byStatus: statusCounts,
      byType: typeCounts,
      byPriority: priorityCounts,
      queues: {
        high: { messageCount: Math.floor(Math.random() * 5), consumerCount: 1 },
        medium: { messageCount: Math.floor(Math.random() * 10), consumerCount: 1 },
        low: { messageCount: Math.floor(Math.random() * 15), consumerCount: 1 },
        retry: { messageCount: Math.floor(Math.random() * 3), consumerCount: 1 },
        dlq: { messageCount: Math.floor(Math.random() * 2), consumerCount: 0 }
      },
      timestamp: new Date()
    };
  }

  // Logs operations
  async createLog(logData) {
    const log = {
      ...logData,
      timestamp: logData.timestamp || new Date()
    };
    logs.push(log);
    return log;
  }

  async getJobLogs(jobId) {
    return logs.filter(log => log.jobId === jobId)
              .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  // Get all jobs for debugging
  getAllJobsSync() {
    return jobs;
  }

  // Get all logs for debugging
  getAllLogsSync() {
    return logs;
  }
}

module.exports = new MockDatabase();