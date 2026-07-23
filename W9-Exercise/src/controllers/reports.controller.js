import db from '../models/index.js';
const { Op, Sequelize } = db.Sequelize;

/**
 * GET /api/reports/student-performance
 * Returns detailed performance for each student: courses taken, average score, total credits earned, pass count
 */
export const getStudentPerformance = async (req, res) => {
  try {
    const students = await db.Student.findAll({
      include: [
        {
          model: db.Score,
          as: 'scores',
          include: [
            {
              model: db.Course,
              as: 'course'
            }
          ]
        }
      ]
    });

    const performance = students.map(student => {
      const scores = student.scores || [];
      const totalCourses = scores.length;
      const totalScoreSum = scores.reduce((sum, s) => sum + s.score, 0);
      const averageScore = totalCourses > 0 ? parseFloat((totalScoreSum / totalCourses).toFixed(2)) : 0;
      const passedScores = scores.filter(s => s.score >= 60);
      const passCount = passedScores.length;
      const failCount = totalCourses - passCount;
      const totalCreditsEarned = passedScores.reduce((credits, s) => credits + (s.course ? s.course.credit : 0), 0);

      return {
        student_id: student.id,
        full_name: student.full_name,
        email: student.email,
        total_courses_enrolled: totalCourses,
        average_score: averageScore,
        pass_count: passCount,
        fail_count: failCount,
        total_credits_earned: totalCreditsEarned,
        status: averageScore >= 85 ? 'Excellent' : averageScore >= 60 ? 'Satisfactory' : 'At Risk'
      };
    });

    return res.status(200).json({
      success: true,
      endpoint: '/api/reports/student-performance',
      count: performance.length,
      data: performance
    });
  } catch (error) {
    console.error('Error in student-performance report:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/reports/course-performance
 * Returns performance summary for each course
 */
export const getCoursePerformance = async (req, res) => {
  try {
    const courses = await db.Course.findAll({
      include: [
        {
          model: db.Major,
          as: 'major',
          attributes: ['id', 'name', 'code']
        },
        {
          model: db.Score,
          as: 'scores'
        }
      ]
    });

    const courseData = courses.map(course => {
      const scores = course.scores || [];
      const totalEnrolled = scores.length;
      const scoreSum = scores.reduce((sum, s) => sum + s.score, 0);
      const avgScore = totalEnrolled > 0 ? parseFloat((scoreSum / totalEnrolled).toFixed(2)) : 0;
      const passCount = scores.filter(s => s.score >= 60).length;
      const passRate = totalEnrolled > 0 ? parseFloat(((passCount / totalEnrolled) * 100).toFixed(2)) : 0;

      return {
        course_id: course.id,
        course_name: course.name,
        credit: course.credit,
        status: course.status,
        major: course.major ? course.major.name : null,
        total_enrolled: totalEnrolled,
        average_score: avgScore,
        passed_count: passCount,
        failed_count: totalEnrolled - passCount,
        pass_rate_percentage: passRate
      };
    });

    return res.status(200).json({
      success: true,
      endpoint: '/api/reports/course-performance',
      count: courseData.length,
      data: courseData
    });
  } catch (error) {
    console.error('Error in course-performance report:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/reports/major-performance
 * Returns performance summary per academic major
 */
export const getMajorPerformance = async (req, res) => {
  try {
    const majors = await db.Major.findAll({
      include: [
        {
          model: db.Course,
          as: 'courses',
          include: [
            {
              model: db.Score,
              as: 'scores'
            }
          ]
        }
      ]
    });

    const majorData = majors.map(major => {
      const courses = major.courses || [];
      const allScores = courses.flatMap(c => c.scores || []);
      const totalStudentsEnrolled = allScores.length;
      const scoreSum = allScores.reduce((sum, s) => sum + s.score, 0);
      const avgScore = totalStudentsEnrolled > 0 ? parseFloat((scoreSum / totalStudentsEnrolled).toFixed(2)) : 0;

      return {
        major_id: major.id,
        major_name: major.name,
        code: major.code,
        total_courses: courses.length,
        total_enrollments: totalStudentsEnrolled,
        average_score: avgScore
      };
    });

    return res.status(200).json({
      success: true,
      endpoint: '/api/reports/major-performance',
      count: majorData.length,
      data: majorData
    });
  } catch (error) {
    console.error('Error in major-performance report:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/reports/top-students
 * Returns students with average score >= 85 or top performing students
 */
export const getTopStudents = async (req, res) => {
  try {
    const minAvg = req.query.minAvg ? parseFloat(req.query.minAvg) : 85;

    const students = await db.Student.findAll({
      include: [
        {
          model: db.Score,
          as: 'scores',
          include: [{ model: db.Course, as: 'course' }]
        }
      ]
    });

    const topStudents = students
      .map(student => {
        const scores = student.scores || [];
        const total = scores.length;
        const sum = scores.reduce((acc, s) => acc + s.score, 0);
        const avg = total > 0 ? parseFloat((sum / total).toFixed(2)) : 0;

        return {
          student_id: student.id,
          full_name: student.full_name,
          email: student.email,
          courses_taken: total,
          average_score: avg,
          high_scores: scores.filter(s => s.score >= 85).map(s => ({
            course: s.course ? s.course.name : null,
            score: s.score,
            academic_year: s.academic_year
          }))
        };
      })
      .filter(student => student.average_score >= minAvg)
      .sort((a, b) => b.average_score - a.average_score);

    return res.status(200).json({
      success: true,
      endpoint: '/api/reports/top-students',
      count: topStudents.length,
      data: topStudents
    });
  } catch (error) {
    console.error('Error in top-students report:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/reports/at-risk-students
 * Returns students with average score < 60 or failing grades
 */
export const getAtRiskStudents = async (req, res) => {
  try {
    const threshold = req.query.threshold ? parseFloat(req.query.threshold) : 60;

    const students = await db.Student.findAll({
      include: [
        {
          model: db.Score,
          as: 'scores',
          include: [{ model: db.Course, as: 'course' }]
        }
      ]
    });

    const atRiskStudents = students
      .map(student => {
        const scores = student.scores || [];
        const total = scores.length;
        const sum = scores.reduce((acc, s) => acc + s.score, 0);
        const avg = total > 0 ? parseFloat((sum / total).toFixed(2)) : 0;
        const failedCourses = scores.filter(s => s.score < threshold);

        return {
          student_id: student.id,
          full_name: student.full_name,
          email: student.email,
          average_score: avg,
          failed_course_count: failedCourses.length,
          failed_courses: failedCourses.map(s => ({
            course: s.course ? s.course.name : null,
            score: s.score,
            academic_year: s.academic_year
          }))
        };
      })
      .filter(student => student.average_score < threshold || student.failed_course_count > 0);

    return res.status(200).json({
      success: true,
      endpoint: '/api/reports/at-risk-students',
      count: atRiskStudents.length,
      data: atRiskStudents
    });
  } catch (error) {
    console.error('Error in at-risk-students report:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/reports/pass-rate
 * Returns overall academic pass rate metrics
 */
export const getPassRate = async (req, res) => {
  try {
    const scores = await db.Score.findAll({
      include: [{ model: db.Course, as: 'course' }]
    });

    const totalScores = scores.length;
    const passThreshold = req.query.threshold ? parseFloat(req.query.threshold) : 60;
    const passedScores = scores.filter(s => s.score >= passThreshold).length;
    const failedScores = totalScores - passedScores;
    const overallPassRate = totalScores > 0 ? parseFloat(((passedScores / totalScores) * 100).toFixed(2)) : 0;

    return res.status(200).json({
      success: true,
      endpoint: '/api/reports/pass-rate',
      data: {
        total_evaluations: totalScores,
        pass_threshold: passThreshold,
        passed_count: passedScores,
        failed_count: failedScores,
        overall_pass_rate_percentage: overallPassRate
      }
    });
  } catch (error) {
    console.error('Error in pass-rate report:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
