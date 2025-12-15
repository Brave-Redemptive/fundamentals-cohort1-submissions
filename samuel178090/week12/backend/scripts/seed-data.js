/**
 * Seed Data Script - Samuel Ajewole
 * Software Engineering Week 12 Challenge
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const NotificationJob = require('../src/models/NotificationJob');
const NotificationLog = require('../src/models/NotificationLog');

async function seedData() {
  try {
    console.log('🌱 Seeding WaveCom Notification System...');
    console.log('Author: Samuel Ajewole (PG/CSC/250006)');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await NotificationJob.deleteMany({});
    await NotificationLog.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Sample notification jobs
    const sampleJobs = [
      {
        jobId: uuidv4(),
        clientId: 'samuel-client',
        type: 'email',
        recipient: 'josephsammy1994@gmail.com',
        subject: 'Welcome to WaveCom Notification System',
        message: 'Your scalable notification delivery system is now active and ready to handle enterprise-level traffic!',
        priority: 'high',
        status: 'delivered',
        attempts: 1,
        maxAttempts: 5,
        scheduledAt: new Date(),
        processedAt: new Date(),
        sentAt: new Date(),
        deliveredAt: new Date(),
        metadata: {
          campaign: 'welcome',
          author: 'Samuel Ajewole',
          studentId: 'PG/CSC/250006'
        }
      },
      {
        jobId: uuidv4(),
        clientId: 'demo-client',
        type: 'sms',
        recipient: '+1234567890',
        message: 'SMS notification test from WaveCom system. Capable of handling 50,000+ messages per minute!',
        priority: 'medium',
        status: 'sent',
        attempts: 1,
        maxAttempts: 5,
        scheduledAt: new Date(),
        processedAt: new Date(),
        sentAt: new Date(),
        metadata: {
          type: 'test',
          provider: 'mock-sms'
        }
      },
      {
        jobId: uuidv4(),
        clientId: 'enterprise-client',
        type: 'push',
        recipient: 'device-token-123',
        message: 'Push notification from WaveCom - Your enterprise notification solution',
        priority: 'low',
        status: 'processing',
        attempts: 0,
        maxAttempts: 5,
        scheduledAt: new Date(),
        processedAt: new Date(),
        metadata: {
          deviceType: 'mobile',
          platform: 'android'
        }
      },
      {
        jobId: uuidv4(),
        clientId: 'test-client',
        type: 'email',
        recipient: 'test@example.com',
        subject: 'System Performance Test',
        message: 'This is a test notification to demonstrate system reliability and fault tolerance.',
        priority: 'medium',
        status: 'failed',
        attempts: 5,
        maxAttempts: 5,
        scheduledAt: new Date(Date.now() - 3600000), // 1 hour ago
        lastError: 'Mock provider temporarily unavailable',
        errorHistory: [
          { error: 'Connection timeout', timestamp: new Date(Date.now() - 3000000), attempt: 1 },
          { error: 'Rate limit exceeded', timestamp: new Date(Date.now() - 2000000), attempt: 2 },
          { error: 'Mock provider temporarily unavailable', timestamp: new Date(Date.now() - 1000000), attempt: 3 }
        ],
        metadata: {
          testType: 'failure-simulation'
        }
      }
    ];

    // Insert jobs
    const insertedJobs = await NotificationJob.insertMany(sampleJobs);
    console.log(`✅ Inserted ${insertedJobs.length} sample notification jobs`);

    // Create corresponding logs
    const sampleLogs = [];
    insertedJobs.forEach(job => {
      // Created log
      sampleLogs.push({
        jobId: job.jobId,
        clientId: job.clientId,
        event: 'created',
        message: 'Notification job created',
        timestamp: new Date(job.createdAt.getTime() + 1000),
        metadata: { source: 'seed-script' }
      });

      // Status-specific logs
      if (job.status === 'delivered') {
        sampleLogs.push({
          jobId: job.jobId,
          clientId: job.clientId,
          event: 'queued',
          message: 'Job queued for processing',
          timestamp: new Date(job.createdAt.getTime() + 2000),
          metadata: { queue: 'high_priority' }
        });
        sampleLogs.push({
          jobId: job.jobId,
          clientId: job.clientId,
          event: 'processing',
          message: 'Job is being processed',
          timestamp: new Date(job.createdAt.getTime() + 3000),
          metadata: { worker: 'worker-1' }
        });
        sampleLogs.push({
          jobId: job.jobId,
          clientId: job.clientId,
          event: 'sent',
          message: 'Notification sent successfully',
          timestamp: new Date(job.createdAt.getTime() + 4000),
          metadata: { provider: 'mock-email', messageId: 'msg_123' }
        });
        sampleLogs.push({
          jobId: job.jobId,
          clientId: job.clientId,
          event: 'delivered',
          message: 'Notification delivered successfully',
          timestamp: new Date(job.createdAt.getTime() + 5000),
          metadata: { deliveryTime: '2.5s' }
        });
      } else if (job.status === 'failed') {
        job.errorHistory.forEach((error, index) => {
          sampleLogs.push({
            jobId: job.jobId,
            clientId: job.clientId,
            event: 'retry',
            message: `Retry attempt ${error.attempt}: ${error.error}`,
            timestamp: error.timestamp,
            metadata: { attempt: error.attempt, error: error.error }
          });
        });
        sampleLogs.push({
          jobId: job.jobId,
          clientId: job.clientId,
          event: 'failed',
          message: `Job failed after ${job.attempts} attempts`,
          timestamp: new Date(),
          metadata: { finalError: job.lastError }
        });
      }
    });

    await NotificationLog.insertMany(sampleLogs);
    console.log(`✅ Inserted ${sampleLogs.length} sample logs`);

    // Display summary
    console.log('\n📊 Seed Data Summary:');
    console.log(`   Total Jobs: ${insertedJobs.length}`);
    console.log(`   Total Logs: ${sampleLogs.length}`);
    console.log(`   Job Types: Email (2), SMS (1), Push (1)`);
    console.log(`   Statuses: Delivered (1), Sent (1), Processing (1), Failed (1)`);
    
    console.log('\n🎯 Sample data seeded successfully!');
    console.log('You can now test the API endpoints with real data.');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;