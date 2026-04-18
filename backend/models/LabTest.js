const mongoose = require('mongoose');

const labTestSchema = new mongoose.Schema({
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
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testType: {
    type: String,
    required: [true, 'Please provide test type'],
    enum: [
      'Blood Test',
      'Urine Test',
      'X-Ray',
      'MRI',
      'CT Scan',
      'Ultrasound',
      'ECG',
      'EEG',
      'Endoscopy',
      'Biopsy',
      'Culture Test',
      'Allergy Test',
      'Thyroid Test',
      'Liver Function Test',
      'Kidney Function Test',
      'Complete Blood Count',
      'Blood Sugar Test',
      'Lipid Profile',
      'Other'
    ]
  },
  testName: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['Normal', 'Urgent', 'Critical'],
    default: 'Normal'
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  sampleCollected: {
    type: Boolean,
    default: false
  },
  sampleCollectionDate: {
    type: Date
  },
  assignedEquipment: {
    type: String
  },
  assignedTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  testResults: {
    result: String,
    values: [{
      parameter: String,
      value: String,
      normalRange: String,
      unit: String
    }],
    notes: String,
    interpretedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    interpretedAt: Date
  },
  reportFile: {
    type: String
  },
  sampleExpiryDate: {
    type: Date
  },
  storageConditions: {
    type: String,
    enum: ['Room Temperature', 'Refrigerated', 'Frozen', 'Special Conditions']
  },
  notes: {
    type: String
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LabTest', labTestSchema);
