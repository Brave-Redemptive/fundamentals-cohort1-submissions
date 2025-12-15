/**
 * NotificationJob Model - Samuel Ajewole
 * Software Engineering Week 12 Challenge
 */

const mongoose = require('mongoose');

const notificationJobSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true,
    unique: true
  },
  clientId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['email', 'sms', 'push']
  },
  recipient: {
    type: String,
    required: true
  },
  subject: {
    type: String
  },
  message: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'queued', 'processing', 'sent', 'delivered', 'failed'],
    default: 'pending'
  },
  attempts: {
    type: Number,
    default: 0
  },
  maxAttempts: {
    type: Number,
    default: 5
  },
  scheduledAt: {
    type: Date,
    default: Date.now
  },
  processedAt: Date,
  sentAt: Date,
  deliveredAt: Date,
  nextRetryAt: Date,
  lastError: String,
  errorHistory: [{
    error: String,
    timestamp: { type: Date, default: Date.now },
    attempt: Number
  }],
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for performance
notificationJobSchema.index({ jobId: 1 });
notificationJobSchema.index({ clientId: 1, createdAt: -1 });
notificationJobSchema.index({ status: 1, priority: -1 });
notificationJobSchema.index({ nextRetryAt: 1 });

module.exports = mongoose.model('NotificationJob', notificationJobSchema);