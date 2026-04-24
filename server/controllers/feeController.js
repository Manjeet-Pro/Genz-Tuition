const Fee = require('../models/Fee');
const Student = require('../models/Student');

// @desc    Record or update fee payment
// @route   POST /api/fees
// @access  Private
const recordPayment = async (req, res) => {
  try {
    const { studentId, month, amountPaid, totalAmount, status, paymentDate, remarks, paymentMode } = req.body;
    console.log('Recording Payment:', { month, amountPaid, status, paymentMode });

    // Check if fee record already exists for this month
    let fee = await Fee.findOne({ student: studentId, month });

    if (fee) {
      // Update existing record
      fee.amountPaid = amountPaid;
      fee.totalAmount = totalAmount;
      fee.status = status;
      fee.paymentDate = paymentDate || Date.now();
      fee.remarks = remarks;
      fee.paymentMode = paymentMode || 'Cash';
      const updatedFee = await fee.save();
      res.json(updatedFee);
    } else {
      // Create new record
      const newFee = new Fee({
        student: studentId,
        month,
        amountPaid,
        totalAmount,
        status,
        paymentDate: paymentDate || Date.now(),
        remarks,
        paymentMode: paymentMode || 'Cash'
      });
      const createdFee = await newFee.save();
      res.status(201).json(createdFee);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get fee history for a student
// @route   GET /api/fees/student/:id
// @access  Private
const getStudentFeeHistory = async (req, res) => {
  try {
    const fees = await Fee.find({ student: req.params.id }).sort({ createdAt: -1 });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all pending fees
// @route   GET /api/fees/pending
// @access  Private
const getPendingFees = async (req, res) => {
  try {
    const pendingFees = await Fee.find({ 
      status: { $in: ['Unpaid', 'Partial'] } 
    }).populate('student', 'fullName mobileNumber studentClass batchTiming');
    res.json(pendingFees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get monthly collection report
// @route   GET /api/fees/report/:month
// @access  Private
const getMonthlyFeeReport = async (req, res) => {
  try {
    const fees = await Fee.find({ month: req.params.month }).populate('student', 'fullName');
    
    const totalCollected = fees.reduce((acc, curr) => acc + curr.amountPaid, 0);
    const totalDue = fees.reduce((acc, curr) => acc + (curr.totalAmount - curr.amountPaid), 0);

    res.json({
      month: req.params.month,
      count: fees.length,
      totalCollected,
      totalDue,
      records: fees
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete fee record
// @route   DELETE /api/fees/:id
// @access  Private
const deleteFeeRecord = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);

    if (fee) {
      await fee.deleteOne();
      res.json({ message: 'Fee record removed' });
    } else {
      res.status(404).json({ message: 'Fee record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  recordPayment,
  getStudentFeeHistory,
  getPendingFees,
  getMonthlyFeeReport,
  deleteFeeRecord
};
