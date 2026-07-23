import express from 'express';
import {
  getStudentPerformance,
  getCoursePerformance,
  getMajorPerformance,
  getTopStudents,
  getAtRiskStudents,
  getPassRate
} from '../controllers/reports.controller.js';
import { searchStudentsByScore } from '../controllers/exercises.controller.js';

const router = express.Router();

// Exercise 3 endpoint matching GET /api/reports/scores?keyword=dara&minScore=70
router.get('/scores', searchStudentsByScore);

// Part II Academic Performance API endpoints
router.get('/student-performance', getStudentPerformance);
router.get('/course-performance', getCoursePerformance);
router.get('/major-performance', getMajorPerformance);
router.get('/top-students', getTopStudents);
router.get('/at-risk-students', getAtRiskStudents);
router.get('/pass-rate', getPassRate);

export default router;
