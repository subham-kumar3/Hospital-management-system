const mongoose = require('mongoose');

const medicationLogSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  prescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription',
    required: true
  },
  medicine: {
    name: {
      type: String,
      required: true
    },
    dosage: {
      type: String,
      required: true
    },
    frequency: {
      type: String,
      required: true
    },
    instructions: {
      type: String
    }
  },
  nurse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['Pending', 'Given', 'Missed', 'Delayed'],
    default: 'Pending'
  },
  administeredAt: {
    type: Date
  },
  notes: {
    type: String
  },
  scheduledTime: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
medicationLogSchema.index({ patient: 1, status: 1, createdAt: -1 });
medicationLogSchema.index({ nurse: 1, createdAt: -1 });

module.exports = mongoose.model('MedicationLog', medicationLogSchema);
