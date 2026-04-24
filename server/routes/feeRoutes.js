const express = require('express');
const router = express.Router();
const {
  recordPayment,
  getStudentFeeHistory,
  getPendingFees,
  getMonthlyFeeReport,
  deleteFeeRecord
} = require('../controllers/feeController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', recordPayment);
router.get('/student/:id', getStudentFeeHistory);
router.get('/pending', getPendingFees);
router.get('/report/:month', getMonthlyFeeReport);
router.delete('/:id', deleteFeeRecord);

module.exports = router;
