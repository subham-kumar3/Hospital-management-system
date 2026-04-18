const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide department name'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide department description']
  },
  floor: {
    type: String,
    required: [true, 'Please provide floor location']
  },
  equipment: {
    type: String,
    enum: ['Basic', 'Modern', 'Advanced'],
    default: 'Advanced'
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number']
  },
  email: {
    type: String,
    required: [true, 'Please provide email address'],
    lowercase: true
  },
  headOfDepartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  totalDoctors: {
    type: Number,
    default: 0
  },
  totalPatients: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Department', departmentSchema);
