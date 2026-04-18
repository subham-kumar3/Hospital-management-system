const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
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
  diagnosis: {
    type: String,
    required: [true, 'Please provide diagnosis']
  },
  treatment: {
    type: String,
    required: [true, 'Please provide treatment details']
  },
  type: {
    type: String,
    required: true,
    enum: ['Outpatient', 'Inpatient', 'Emergency', 'Surgical']
  },
  symptoms: [String],
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String
  }],
  labTests: [{
    testName: String,
    result: String,
    date: Date
  }],
  admissionDate: Date,
  dischargeDate: Date,
  notes: String,
  followUpDate: Date,
  attachments: [{
    fileName: String,
    fileUrl: String,
    uploadDate: Date
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
