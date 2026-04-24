const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAttendanceByDate,
  getStudentAttendanceHistory,
  getMonthlyAttendanceReport
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', markAttendance);
router.get('/date/:date', getAttendanceByDate);
router.get('/student/:id', getStudentAttendanceHistory);
router.get('/report/:month/:year', getMonthlyAttendanceReport);

module.exports = router;
