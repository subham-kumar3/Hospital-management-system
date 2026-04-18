const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: [true, 'Please provide patient name'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Please provide patient age']
  },
  gender: {
    type: String,
    required: [true, 'Please provide gender'],
    enum: ['Male', 'Female', 'Other']
  },
  bloodGroup: {
    type: String,
    required: [true, 'Please provide blood group'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number']
  },
  email: {
    type: String,
    required: [true, 'Please provide email address'],
    unique: true,
    lowercase: true
  },
  address: {
    type: String,
    required: [true, 'Please provide address']
  },
  admittedDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Admitted', 'Discharged', 'Critical', 'Stable'],
    default: 'Admitted'
  },
  ward: {
    type: String,
    enum: ['General Ward', 'ICU', 'Emergency', 'Private Room', 'Semi-Private', 'Pediatric Ward']
  },
  roomNumber: {
    type: String
  },
  bedNumber: {
    type: String
  },
  assignedNurse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  medicalHistory: [{
    diagnosis: String,
    treatment: String,
    date: Date,
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    }
  }]
}, {
  timestamps: true
});

// Auto-generate patient ID
patientSchema.pre('save', async function() {
  if (this.isNew && !this.patientId) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await mongoose.model('Patient').countDocuments();
    this.patientId = `PAT-${dateStr}-${(count + 1).toString().padStart(4, '0')}`;
  }
});

module.exports = mongoose.model('Patient', patientSchema);
