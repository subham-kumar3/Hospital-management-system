const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  hospitalInfo: {
    name: {
      type: String,
      default: 'Hospital Management System'
    },
    address: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    },
    website: {
      type: String,
      default: ''
    },
    logo: {
      type: String,
      default: ''
    }
  },
  workingHours: {
    monday: { open: { type: String, default: '09:00' }, close: { type: String, default: '18:00' } },
    tuesday: { open: { type: String, default: '09:00' }, close: { type: String, default: '18:00' } },
    wednesday: { open: { type: String, default: '09:00' }, close: { type: String, default: '18:00' } },
    thursday: { open: { type: String, default: '09:00' }, close: { type: String, default: '18:00' } },
    friday: { open: { type: String, default: '09:00' }, close: { type: String, default: '18:00' } },
    saturday: { open: { type: String, default: '09:00' }, close: { type: String, default: '13:00' } },
    sunday: { open: { type: String, default: 'Closed' }, close: { type: String, default: 'Closed' } }
  },
  appointmentSlotDuration: {
    type: Number,
    default: 30 // minutes
  },
  security: {
    maxLoginAttempts: {
      type: Number,
      default: 5
    },
    lockoutDuration: {
      type: Number,
      default: 2 // hours
    },
    passwordMinLength: {
      type: Number,
      default: 6
    },
    sessionTimeout: {
      type: Number,
      default: 24 // hours
    }
  },
  notificationPreferences: {
    email: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
    },
    inApp: {
      type: Boolean,
      default: true
    }
  },
  backupSchedule: {
    frequency: {
      type: String,
      enum: ['Daily', 'Weekly', 'Monthly'],
      default: 'Daily'
    },
    lastBackup: {
      type: Date
    },
    backupLocation: {
      type: String,
      default: ''
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
