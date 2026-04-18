const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  billNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [{
    description: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      default: 1
    },
    unitPrice: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  }],
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  balance: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Partial', 'Paid'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'UPI', 'Insurance', 'Bank Transfer']
  },
  paymentDate: {
    type: Date
  },
  notes: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['Active', 'Cancelled'],
    default: 'Active'
  }
}, {
  timestamps: true
});

// Auto-generate bill number
billSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Bill').countDocuments();
    this.billNumber = `BILL-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
    
    // Calculate totals
    this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
    this.totalAmount = this.subtotal + this.tax - this.discount;
    this.balance = this.totalAmount - this.paidAmount;
    
    // Update payment status
    if (this.paidAmount >= this.totalAmount) {
      this.paymentStatus = 'Paid';
    } else if (this.paidAmount > 0) {
      this.paymentStatus = 'Partial';
    }
  }
  next();
});

module.exports = mongoose.model('Bill', billSchema);
