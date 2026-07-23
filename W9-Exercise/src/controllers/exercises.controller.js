import db from '../models/index.js';
const { Op, Sequelize } = db.Sequelize;

/**
 * Exercise 1: High-performing students in a specific year
 * Display students who:
 * - studied in academic year 2025-2026
 * - received a score >= 85
 * - belong to active courses only
 * Expected fields: Student ID, Full Name, Course, Score, Academic Year
 */
export const getHighPerformingStudents = async (req, res) => {
  try {
    const academicYear = req.query.academic_year || '2025-2026';
    const minScore = req.query.minScore ? parseFloat(req.query.minScore) : 85;

    const scores = await db.Score.findAll({
      where: {
        academic_year: academicYear,
        score: { [Op.gte]: minScore }
      },
      include: [
        {
          model: db.Student,
          as: 'student',
          attributes: ['id', 'full_name']
        },
        {
          model: db.Course,
          as: 'course',
          where: { status: 'active' },
          attributes: ['id', 'name', 'status']
        }
      ]
    });

    const formattedData = scores.map(item => ({
      student_id: item.student.id,
      full_name: item.student.full_name,
      course: item.course.name,
      score: item.score,
      academic_year: item.academic_year
    }));

    return res.status(200).json({
      success: true,
      exercise: 'Exercise 1: High-performing students in a specific year',
      count: formattedData.length,
      data: formattedData
    });
  } catch (error) {
    console.error('Error in Exercise 1:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Exercise 2: Multiple score conditions using Op.between
 * Display scores that are:
 * - score >= 60
 * - score <= 90
 * - academic_year = "2025-2026"
 */
export const getScoreRange = async (req, res) => {
  try {
    const academicYear = req.query.academic_year || '2025-2026';
    const min = req.query.min ? parseFloat(req.query.min) : 60;
    const max = req.query.max ? parseFloat(req.query.max) : 90;

    const scores = await db.Score.findAll({
      where: {
        score: { [Op.between]: [min, max] },
        academic_year: academicYear
      },
      include: [
        {
          model: db.Student,
          as: 'student',
          attributes: ['id', 'full_name']
        },
        {
          model: db.Course,
          as: 'course',
          attributes: ['id', 'name']
        }
      ]
    });

    const formattedData = scores.map(item => ({
      score_id: item.id,
      student_id: item.student ? item.student.id : null,
      student_name: item.student ? item.student.full_name : null,
      course_name: item.course ? item.course.name : null,
      score: item.score,
      academic_year: item.academic_year
    }));

    return res.status(200).json({
      success: true,
      exercise: 'Exercise 2: Multiple score conditions (Op.between)',
      count: formattedData.length,
      data: formattedData
    });
  } catch (error) {
    console.error('Error in Exercise 2:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Exercise 3: Search students by name and score
 * Accept query parameters: GET /api/reports/scores?keyword=dara&minScore=70
 * Search by: full_name, minimum score
 * Operators: Op.or, Op.like / Op.iLike, Op.gte
 */
export const searchStudentsByScore = async (req, res) => {
  try {
    const { keyword, minScore, academic_year } = req.query;

    const scoreWhere = {};
    if (minScore !== undefined && minScore !== '') {
      scoreWhere.score = { [Op.gte]: parseFloat(minScore) };
    }
    if (academic_year) {
      scoreWhere.academic_year = academic_year;
    }

    const studentWhere = {};
    if (keyword) {
      const isSqlite = db.sequelize.getDialect() === 'sqlite';
      const likeOp = isSqlite ? Op.like : Op.iLike;
      studentWhere.full_name = { [likeOp]: `%${keyword}%` };
    }

    const scores = await db.Score.findAll({
      where: scoreWhere,
      include: [
        {
          model: db.Student,
          as: 'student',
          where: Object.keys(studentWhere).length > 0 ? studentWhere : undefined,
          attributes: ['id', 'full_name', 'email']
        },
        {
          model: db.Course,
          as: 'course',
          attributes: ['id', 'name']
        }
      ]
    });

    const formattedData = scores.map(item => ({
      score_id: item.id,
      student_id: item.student.id,
      full_name: item.student.full_name,
      course: item.course.name,
      score: item.score,
      academic_year: item.academic_year
    }));

    return res.status(200).json({
      success: true,
      exercise: 'Exercise 3: Search students by name and score',
      count: formattedData.length,
      data: formattedData
    });
  } catch (error) {
    console.error('Error in Exercise 3:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Exercise 4: Full academic report
 * Relationship path: Student -> Score -> Course -> Major
 * Displays: Student, Score, Academic year, Course, Credit, Major
 */
export const getFullAcademicReport = async (req, res) => {
  try {
    const students = await db.Student.findAll({
      attributes: ['id', 'full_name', 'gender', 'email'],
      include: [
        {
          model: db.Score,
          as: 'scores',
          attributes: ['id', 'score', 'academic_year'],
          include: [
            {
              model: db.Course,
              as: 'course',
              attributes: ['id', 'name', 'credit', 'status'],
              include: [
                {
                  model: db.Major,
                  as: 'major',
                  attributes: ['id', 'name', 'code']
                }
              ]
            }
          ]
        }
      ]
    });

    const formattedReport = students.map(student => {
      const records = (student.scores || []).map(s => ({
        score_id: s.id,
        score: s.score,
        academic_year: s.academic_year,
        course_name: s.course ? s.course.name : null,
        credit: s.course ? s.course.credit : null,
        course_status: s.course ? s.course.status : null,
        major_name: s.course && s.course.major ? s.course.major.name : null,
        major_code: s.course && s.course.major ? s.course.major.code : null
      }));

      return {
        student_id: student.id,
        full_name: student.full_name,
        email: student.email,
        total_records: records.length,
        academic_records: records
      };
    });

    return res.status(200).json({
      success: true,
      exercise: 'Exercise 4: Full Academic Report (Student -> Score -> Course -> Major)',
      count: formattedReport.length,
      data: formattedReport
    });
  } catch (error) {
    console.error('Error in Exercise 4:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Exercise 5: Average score for each student
 * Task: return student_id, full_name, average_score
 * Usage: Sequelize.fn("AVG", ...) and group
 */
export const getAverageScorePerStudent = async (req, res) => {
  try {
    const isSqlite = db.sequelize.getDialect() === 'sqlite';
    const avgFn = isSqlite
      ? [Sequelize.fn('ROUND', Sequelize.fn('AVG', Sequelize.col('scores.score')), 2), 'average_score']
      : [Sequelize.fn('ROUND', Sequelize.fn('AVG', Sequelize.col('scores.score')), 2), 'average_score'];

    const results = await db.Student.findAll({
      attributes: [
        ['id', 'student_id'],
        'full_name',
        avgFn
      ],
      include: [
        {
          model: db.Score,
          as: 'scores',
          attributes: []
        }
      ],
      group: ['Student.id', 'Student.full_name'],
      raw: true
    });

    return res.status(200).json({
      success: true,
      exercise: 'Exercise 5: Average score for each student',
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Error in Exercise 5:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
