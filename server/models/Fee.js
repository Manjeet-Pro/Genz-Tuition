const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  month: {
    type: String,
    required: true // Format: "MMMM YYYY" e.g., "October 2026"
  },
  amountPaid: {
    type: Number,
    required: true,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Partial'],
    default: 'Unpaid'
  },
  paymentDate: {
    type: Date
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  remarks: {
    type: String
  },
  paymentMode: {
    type: String,
    enum: ['Cash', 'UPI', 'Others'],
    default: 'Cash'
  }
}, {
  timestamps: true
});

const Fee = mongoose.model('Fee', feeSchema);

module.exports = Fee;
