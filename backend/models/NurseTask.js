const mongoose = require('mongoose');

const nurseTaskSchema = new mongoose.Schema({
  nurse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  taskName: {
    type: String,
    required: [true, 'Please provide task name'],
    trim: true
  },
  taskType: {
    type: String,
    enum: ['Medication', 'Checkup', 'Vitals Check', 'Wound Care', 'IV Therapy', 'Patient Education', 'Other'],
    default: 'Other'
  },
  description: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  scheduledTime: {
    type: Date,
    required: true
  },
  completedAt: {
    type: Date
  },
  notes: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for efficient queries
nurseTaskSchema.index({ nurse: 1, status: 1, scheduledTime: -1 });
nurseTaskSchema.index({ patient: 1, scheduledTime: -1 });

module.exports = mongoose.model('NurseTask', nurseTaskSchema);
