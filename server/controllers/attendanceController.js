const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// @desc    Mark daily attendance for a student
// @route   POST /api/attendance
// @access  Private
const markAttendance = async (req, res) => {
  try {
    const { studentId, date, status, remarks } = req.body;

    // Use a normalized date (set time to midnight) to ensure uniqueness per day
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Check if attendance already marked for this day
    let attendance = await Attendance.findOne({ 
      student: studentId, 
      date: attendanceDate 
    });

    if (attendance) {
      // Update existing record
      attendance.status = status;
      attendance.remarks = remarks;
      const updatedAttendance = await attendance.save();
      res.json(updatedAttendance);
    } else {
      // Create new record
      const newAttendance = new Attendance({
        student: studentId,
        date: attendanceDate,
        status,
        remarks
      });
      const createdAttendance = await newAttendance.save();
      res.status(201).json(createdAttendance);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get attendance for all students on a specific date
// @route   GET /api/attendance/date/:date
// @access  Private
const getAttendanceByDate = async (req, res) => {
  try {
    const queryDate = new Date(req.params.date);
    queryDate.setHours(0, 0, 0, 0);

    const attendanceRecords = await Attendance.find({ date: queryDate }).populate('student', 'fullName studentClass batchTiming');
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendance history for a specific student
// @route   GET /api/attendance/student/:id
// @access  Private
const getStudentAttendanceHistory = async (req, res) => {
  try {
    const history = await Attendance.find({ student: req.params.id }).sort({ date: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get monthly attendance report for all students
// @route   GET /api/attendance/report/:month/:year
// @access  Private
const getMonthlyAttendanceReport = async (req, res) => {
  try {
    const { month, year } = req.params;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendance = await Attendance.find({
      date: { $gte: startDate, $lte: endDate }
    }).populate('student', 'fullName studentClass');

    // Aggregate stats per student
    const report = {};

    attendance.forEach(record => {
      const studentId = record.student._id.toString();
      if (!report[studentId]) {
        report[studentId] = {
          name: record.student.fullName,
          class: record.student.studentClass,
          present: 0,
          absent: 0,
          leave: 0,
          total: 0
        };
      }

      report[studentId][record.status.toLowerCase()]++;
      report[studentId].total++;
    });

    res.json(Object.values(report));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  markAttendance,
  getAttendanceByDate,
  getStudentAttendanceHistory,
  getMonthlyAttendanceReport
};
