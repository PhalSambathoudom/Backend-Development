import db from './models/index.js';

const seedDatabase = async () => {
  try {
    console.log('Syncing database schema...');
    await db.sequelize.sync({ force: true });
    console.log('Database schema synced successfully.');

    // 1. Seed Majors
    const majors = await db.Major.bulkCreate([
      { name: 'Computer Science', code: 'CS' },
      { name: 'Software Engineering', code: 'SE' },
      { name: 'Data Science', code: 'DS' },
      { name: 'Cyber Security', code: 'CY' }
    ]);
    console.log(`Seeded ${majors.length} majors.`);

    // 2. Seed Courses
    const courses = await db.Course.bulkCreate([
      { name: 'Database Systems', credit: 3, status: 'active', major_id: majors[0].id },
      { name: 'Backend Development', credit: 4, status: 'active', major_id: majors[1].id },
      { name: 'Algorithms & Data Structures', credit: 3, status: 'active', major_id: majors[0].id },
      { name: 'Web Development', credit: 3, status: 'active', major_id: majors[1].id },
      { name: 'Legacy Systems', credit: 2, status: 'inactive', major_id: majors[0].id },
      { name: 'Machine Learning', credit: 4, status: 'active', major_id: majors[2].id }
    ]);
    console.log(`Seeded ${courses.length} courses.`);

    // 3. Seed Students (combined full_name as requested)
    const students = await db.Student.bulkCreate([
      { full_name: 'Dara Chan', gender: 'Male', email: 'dara.chan@cadt.edu.kh' },
      { full_name: 'Sok San', gender: 'Male', email: 'sok.san@cadt.edu.kh' },
      { full_name: 'Vanna Keo', gender: 'Female', email: 'vanna.keo@cadt.edu.kh' },
      { full_name: 'Bona Meng', gender: 'Male', email: 'bona.meng@cadt.edu.kh' },
      { full_name: 'Sreypov Heng', gender: 'Female', email: 'sreypov.heng@cadt.edu.kh' }
    ]);
    console.log(`Seeded ${students.length} students.`);

    // 4. Seed Scores
    // Academic year 2025-2026 scores
    const scores = await db.Score.bulkCreate([
      // Dara Chan (Student 1) - High performer & Search target
      { student_id: students[0].id, course_id: courses[0].id, score: 92.5, academic_year: '2025-2026' }, // DB Systems (active)
      { student_id: students[0].id, course_id: courses[1].id, score: 88.0, academic_year: '2025-2026' }, // Backend (active)
      { student_id: students[0].id, course_id: courses[2].id, score: 95.0, academic_year: '2025-2026' }, // Algorithms (active)

      // Sok San (Student 2) - Mid-range performer
      { student_id: students[1].id, course_id: courses[0].id, score: 75.0, academic_year: '2025-2026' }, // DB Systems
      { student_id: students[1].id, course_id: courses[1].id, score: 68.5, academic_year: '2025-2026' }, // Backend
      { student_id: students[1].id, course_id: courses[3].id, score: 82.0, academic_year: '2025-2026' }, // Web Dev

      // Vanna Keo (Student 3) - High performer
      { student_id: students[2].id, course_id: courses[1].id, score: 89.0, academic_year: '2025-2026' }, // Backend (active)
      { student_id: students[2].id, course_id: courses[5].id, score: 91.5, academic_year: '2025-2026' }, // Machine Learning (active)

      // Bona Meng (Student 4) - Inactive course & At risk
      { student_id: students[3].id, course_id: courses[4].id, score: 87.0, academic_year: '2025-2026' }, // Legacy Systems (INACTIVE course!)
      { student_id: students[3].id, course_id: courses[0].id, score: 52.0, academic_year: '2025-2026' }, // DB Systems (Failed)

      // Sreypov Heng (Student 5) - At risk student
      { student_id: students[4].id, course_id: courses[0].id, score: 48.0, academic_year: '2025-2026' }, // DB Systems
      { student_id: students[4].id, course_id: courses[1].id, score: 55.0, academic_year: '2025-2026' }  // Backend
    ]);
    console.log(`Seeded ${scores.length} scores.`);

    console.log('\n--- SEEDING COMPLETED SUCCESSFULLY ---');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
