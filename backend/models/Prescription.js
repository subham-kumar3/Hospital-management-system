const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
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
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  diagnosis: {
    type: String,
    required: true
  },
  medicines: [{
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
      required: true,
      enum: ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 'As needed']
    },
    duration: {
      type: String,
      required: true
    },
    instructions: {
      type: String
    }
  }],
  notes: {
    type: String
  },
  followUpDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Cancelled', 'Dispensed'],
    default: 'Active'
  },
  dispensedAt: {
    type: Date
  },
  dispensedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  pharmacyNotes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
