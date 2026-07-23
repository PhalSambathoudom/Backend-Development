import express from 'express';
import {
  getHighPerformingStudents,
  getScoreRange,
  searchStudentsByScore,
  getFullAcademicReport,
  getAverageScorePerStudent
} from '../controllers/exercises.controller.js';

const router = express.Router();

// Exercise 1: High-performing students in a specific year
router.get('/ex1', getHighPerformingStudents);

// Exercise 2: Multiple score conditions (Op.between)
router.get('/ex2', getScoreRange);

// Exercise 3: Search students by name and score
router.get('/ex3', searchStudentsByScore);

// Exercise 4: Full academic report
router.get('/ex4', getFullAcademicReport);

// Exercise 5: Average score for each student
router.get('/ex5', getAverageScorePerStudent);

export default router;
