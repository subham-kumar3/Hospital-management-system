const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: ['CREATE_USER', 'UPDATE_USER', 'DELETE_USER', 'RESET_PASSWORD', 'BULK_IMPORT', 'UPDATE_ROLE', 'ACTIVATE_USER', 'DEACTIVATE_USER'],
    required: true
  },
  targetType: {
    type: String,
    enum: ['User', 'Patient', 'Doctor', 'Nurse', 'Receptionist', 'Pharmacist', 'Lab Technician'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  targetName: {
    type: String,
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

// Index for faster queries
adminLogSchema.index({ admin: 1, createdAt: -1 });
adminLogSchema.index({ action: 1, createdAt: -1 });

module.exports = mongoose.model('AdminLog', adminLogSchema);
