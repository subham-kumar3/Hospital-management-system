const mongoose = require('mongoose');

const labNotificationSchema = new mongoose.Schema({
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['Urgent Test', 'Sample Collection', 'Expiry Alert', 'Equipment Alert', 'General'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedTest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LabTest'
  },
  relatedSample: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LabSample'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LabNotification', labNotificationSchema);
