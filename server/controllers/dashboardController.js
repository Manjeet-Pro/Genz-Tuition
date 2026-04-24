const Student = require('../models/Student');
const Fee = require('../models/Fee');
const Attendance = require('../models/Attendance');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    // 1. Total Students
    const totalStudents = await Student.countDocuments({ status: 'Active' });

    // 2. Fees stats for current month
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' }) + ' ' + currentDate.getFullYear();
    
    const monthlyFees = await Fee.find({ month: currentMonth });
    const feesCollected = monthlyFees.reduce((acc, curr) => acc + curr.amountPaid, 0);
    
    // 3. Pending fees (Total across all months or current month?)
    // Let's get total pending from all active records
    const allPending = await Fee.find({ status: { $in: ['Unpaid', 'Partial'] } });
    const pendingFees = allPending.reduce((acc, curr) => acc + (curr.totalAmount - curr.amountPaid), 0);

    // 4. Today's Attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAttendance = await Attendance.find({ date: today });
    const presentToday = todayAttendance.filter(a => a.status === 'Present').length;

    // 5. Chart Data: Monthly Collection Trend (Last 6 months)
    // For simplicity, we'll fetch some recent fee records and aggregate
    // In a real app, you might use Mongo aggregation pipeline
    const recentFees = await Fee.find().sort({ createdAt: -1 }).limit(100);
    const chartData = {};
    recentFees.forEach(f => {
      if (!chartData[f.month]) {
        chartData[f.month] = 0;
      }
      chartData[f.month] += f.amountPaid;
    });

    const formattedChartData = Object.keys(chartData).map(month => ({
      name: month,
      amount: chartData[month]
    })).slice(0, 6).reverse();

    res.json({
      totalStudents,
      feesCollected,
      pendingFees,
      presentToday,
      totalToday: totalStudents, // Assuming all active students should attend
      chartData: formattedChartData
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStats
};
