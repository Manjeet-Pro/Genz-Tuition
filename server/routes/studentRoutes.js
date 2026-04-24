const express = require('express');
const router = express.Router();
const {
  addStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

// All student routes are protected (Admin only)
router.use(protect);

router.route('/')
  .post(addStudent)
  .get(getStudents);

router.route('/:id')
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

module.exports = router;
