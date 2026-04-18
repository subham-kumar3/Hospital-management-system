const mongoose = require('mongoose');

const labSampleSchema = new mongoose.Schema({
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
  sampleId: {
    type: String,
    required: true,
    unique: true
  },
  sampleType: {
    type: String,
    required: true,
    enum: ['Blood', 'Urine', 'Stool', 'Sputum', 'Swab', 'Tissue', 'Bone Marrow', 'Other']
  },
  collectionDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  collectionStatus: {
    type: String,
    enum: ['Pending', 'Collected', 'Not Collected', 'Expired'],
    default: 'Pending'
  },
  collectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  collectionTime: {
    type: Date
  },
  storageConditions: {
    type: String,
    enum: ['Room Temperature', 'Refrigerated', 'Frozen', 'Special Conditions'],
    default: 'Room Temperature'
  },
  expiryDate: {
    type: Date,
    required: true
  },
  storageLocation: {
    type: String
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ['Active', 'Processed', 'Discarded'],
    default: 'Active'
  }
}, {
  timestamps: true
});

// Auto-generate sample ID
labSampleSchema.pre('save', function(next) {
  if (!this.sampleId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.sampleId = `SAM${year}${month}${day}${random}`;
  }
  next();
});

module.exports = mongoose.model('LabSample', labSampleSchema);
