const Student = require('../models/Student');

// @desc    Add new student
// @route   POST /api/students
// @access  Private (Admin only)
const addStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    const createdStudent = await student.save();
    res.status(201).json(createdStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all students with filters
// @route   GET /api/students
// @access  Private (Admin only)
const getStudents = async (req, res) => {
  try {
    const { search, studentClass, batchTiming, status } = req.query;
    
    let query = {};

    // Search by name or mobile
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by class
    if (studentClass) {
      query.studentClass = studentClass;
    }

    // Filter by batch
    if (batchTiming) {
      query.batchTiming = batchTiming;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    const students = await Student.find(query).sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private (Admin only)
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private (Admin only)
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (student) {
      // Update fields
      Object.assign(student, req.body);
      const updatedStudent = await student.save();
      res.json(updatedStudent);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (Admin only)
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (student) {
      await student.deleteOne();
      res.json({ message: 'Student removed' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent
};
