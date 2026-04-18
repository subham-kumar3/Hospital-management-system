const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  purchaseNumber: {
    type: String,
    required: true,
    unique: true
  },
  supplier: {
    name: {
      type: String,
      required: true
    },
    contact: {
      type: String,
      required: true
    },
    email: {
      type: String
    },
    address: {
      type: String
    }
  },
  items: [{
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    unitPrice: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    batchNumber: {
      type: String,
      required: true
    },
    expiryDate: {
      type: Date,
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
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Partial', 'Paid'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'Bank Transfer', 'Credit']
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  expectedDeliveryDate: {
    type: Date
  },
  deliveryDate: {
    type: Date
  },
  deliveryStatus: {
    type: String,
    enum: ['Pending', 'Ordered', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  notes: {
    type: String
  },
  orderedBy: {
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

// Auto-generate purchase number
purchaseSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Purchase').countDocuments();
    this.purchaseNumber = `PUR-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
    
    // Calculate totals
    this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
    this.totalAmount = this.subtotal + this.tax;
  }
  next();
});

module.exports = mongoose.model('Purchase', purchaseSchema);
