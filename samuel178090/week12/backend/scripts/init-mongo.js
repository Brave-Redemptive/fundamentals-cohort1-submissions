/**
 * MongoDB Initialization Script - Samuel Ajewole
 * Software Engineering Week 12 Challenge
 */

// Switch to the wavecom_notifications database
db = db.getSiblingDB('wavecom_notifications');

// Create collections with validation
db.createCollection('notificationjobs', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['jobId', 'clientId', 'type', 'recipient', 'message'],
      properties: {
        jobId: { bsonType: 'string' },
        clientId: { bsonType: 'string' },
        type: { enum: ['email', 'sms', 'push'] },
        recipient: { bsonType: 'string' },
        message: { bsonType: 'string' },
        status: { enum: ['pending', 'queued', 'processing', 'sent', 'delivered', 'failed'] },
        priority: { enum: ['low', 'medium', 'high'] }
      }
    }
  }
});

db.createCollection('notificationlogs', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['jobId', 'clientId', 'event', 'message'],
      properties: {
        jobId: { bsonType: 'string' },
        clientId: { bsonType: 'string' },
        event: { bsonType: 'string' },
        message: { bsonType: 'string' }
      }
    }
  }
});

// Create indexes for performance
db.notificationjobs.createIndex({ jobId: 1 }, { unique: true });
db.notificationjobs.createIndex({ clientId: 1, createdAt: -1 });
db.notificationjobs.createIndex({ status: 1, priority: -1 });
db.notificationjobs.createIndex({ nextRetryAt: 1 });
db.notificationjobs.createIndex({ type: 1 });

db.notificationlogs.createIndex({ jobId: 1, timestamp: 1 });
db.notificationlogs.createIndex({ clientId: 1, timestamp: -1 });

// Insert sample data for testing
db.notificationjobs.insertMany([
  {
    jobId: 'sample-job-1',
    clientId: 'samuel-client',
    type: 'email',
    recipient: 'josephsammy1994@gmail.com',
    subject: 'Welcome to WaveCom',
    message: 'Your notification system is ready!',
    priority: 'high',
    status: 'delivered',
    attempts: 1,
    maxAttempts: 5,
    createdAt: new Date(),
    sentAt: new Date(),
    deliveredAt: new Date(),
    metadata: { campaign: 'welcome', author: 'Samuel Ajewole' }
  },
  {
    jobId: 'sample-job-2',
    clientId: 'demo-client',
    type: 'sms',
    recipient: '+1234567890',
    message: 'Your SMS notification system is working perfectly!',
    priority: 'medium',
    status: 'sent',
    attempts: 1,
    maxAttempts: 5,
    createdAt: new Date(),
    sentAt: new Date(),
    metadata: { type: 'test' }
  }
]);

db.notificationlogs.insertMany([
  {
    jobId: 'sample-job-1',
    clientId: 'samuel-client',
    event: 'created',
    message: 'Notification job created',
    timestamp: new Date(),
    metadata: { author: 'Samuel Ajewole' }
  },
  {
    jobId: 'sample-job-1',
    clientId: 'samuel-client',
    event: 'sent',
    message: 'Email sent successfully',
    timestamp: new Date(),
    metadata: { provider: 'mock-email' }
  }
]);

print('MongoDB initialized successfully for WaveCom Notification System');
print('Author: Samuel Ajewole (PG/CSC/250006)');
print('Collections created: notificationjobs, notificationlogs');
print('Sample data inserted for testing');