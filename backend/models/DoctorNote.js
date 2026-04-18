const mongoose = require('mongoose');

const doctorNoteSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  visitDate: {
    type: Date,
    default: Date.now
  },
  noteType: {
    type: String,
    enum: ['Consultation', 'Follow-up', 'Treatment Plan', 'Diagnosis', 'Observation', 'Discharge Summary'],
    required: true
  },
  chiefComplaint: {
    type: String
  },
  diagnosis: {
    type: String
  },
  treatmentPlan: {
    type: String
  },
  notes: {
    type: String,
    required: true
  },
  followUpDate: {
    type: Date
  },
  followUpNotes: {
    type: String
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for efficient queries
doctorNoteSchema.index({ patient: 1, visitDate: -1 });
doctorNoteSchema.index({ doctor: 1, visitDate: -1 });

module.exports = mongoose.model('DoctorNote', doctorNoteSchema);
