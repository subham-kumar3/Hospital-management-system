const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide medicine name'],
    trim: true
  },
  genericName: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Drops', 'Powder', 'Inhaler', 'Suppository', 'Other']
  },
  manufacturer: {
    type: String,
    required: true
  },
  batchNumber: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide price']
  },
  purchasePrice: {
    type: Number,
    default: 0
  },
  sellingPrice: {
    type: Number,
    default: 0
  },
  stockQuantity: {
    type: Number,
    required: true,
    default: 0
  },
  stock: {
    type: Number,
    default: 0
  },
  minStockLevel: {
    type: Number,
    default: 10
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  supplier: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  expiryDate: {
    type: Date,
    required: true
  },
  description: {
    type: String
  },
  requiresPrescription: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['Active', 'Discontinued', 'Out of Stock'],
    default: 'Active'
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for better search performance
medicineSchema.index({ name: 'text', genericName: 'text' });

// Virtual for checking if stock is low
medicineSchema.virtual('isLowStock').get(function() {
  return this.stockQuantity <= this.lowStockThreshold;
});

// Virtual for checking if expired
medicineSchema.virtual('isExpired').get(function() {
  return this.expiryDate < new Date();
});

module.exports = mongoose.model('Medicine', medicineSchema);
