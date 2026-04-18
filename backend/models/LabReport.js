const mongoose = require('mongoose');

const labReportSchema = new mongoose.Schema({
  labTest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LabTest',
    required: true
  },
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
  reportId: {
    type: String,
    required: true,
    unique: true
  },
  testType: {
    type: String,
    required: true
  },
  testName: {
    type: String,
    required: true
  },
  testResults: {
    result: String,
    values: [{
      parameter: String,
      value: String,
      normalRange: String,
      unit: String
    }],
    notes: String
  },
  reportFile: {
    type: String
  },
  interpretedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interpretedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Draft', 'Final', 'Revised'],
    default: 'Final'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Auto-generate report ID
labReportSchema.pre('save', function(next) {
  if (!this.reportId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.reportId = `RPT${year}${month}${day}${random}`;
  }
  next();
});

module.exports = mongoose.model('LabReport', labReportSchema);
