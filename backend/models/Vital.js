const mongoose = require('mongoose');

const vitalSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  nurse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  temperature: {
    type: Number,
    required: true
  },
  bloodPressure: {
    systolic: {
      type: Number,
      required: true
    },
    diastolic: {
      type: Number,
      required: true
    }
  },
  pulse: {
    type: Number,
    required: true
  },
  oxygenLevel: {
    type: Number,
    required: true
  },
  respiratoryRate: {
    type: Number
  },
  notes: {
    type: String
  },
  recordedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
vitalSchema.index({ patient: 1, recordedAt: -1 });
vitalSchema.index({ nurse: 1, recordedAt: -1 });

module.exports = mongoose.model('Vital', vitalSchema);
