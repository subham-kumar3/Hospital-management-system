const mongoose = require('mongoose');

const nurseNoteSchema = new mongoose.Schema({
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
  noteType: {
    type: String,
    enum: ['Observation', 'Condition', 'Update', 'Emergency', 'General'],
    required: true,
    default: 'General'
  },
  note: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
nurseNoteSchema.index({ patient: 1, createdAt: -1 });
nurseNoteSchema.index({ nurse: 1, createdAt: -1 });

module.exports = mongoose.model('NurseNote', nurseNoteSchema);
