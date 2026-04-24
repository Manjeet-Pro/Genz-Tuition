const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  parentName: {
    type: String,
    required: true
  },
  studentClass: {
    type: String,
    required: true
  },
  batchTiming: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  admissionDate: {
    type: Date,
    default: Date.now
  },
  monthlyFees: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
