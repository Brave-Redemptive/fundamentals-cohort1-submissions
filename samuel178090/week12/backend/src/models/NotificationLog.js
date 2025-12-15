/**
 * NotificationLog Model - Samuel Ajewole
 * Software Engineering Week 12 Challenge
 */

const mongoose = require('mongoose');

const notificationLogSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true
  },
  clientId: {
    type: String,
    required: true
  },
  event: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
notificationLogSchema.index({ jobId: 1, timestamp: 1 });
notificationLogSchema.index({ clientId: 1, timestamp: -1 });

module.exports = mongoose.model('NotificationLog', notificationLogSchema);