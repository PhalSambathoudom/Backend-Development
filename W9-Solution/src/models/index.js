import { Sequelize } from 'sequelize';
import dbConfig from '../config/db.config.js';
import MajorModel from './major.model.js';
import CourseModel from './course.model.js';
import StudentModel from './student.model.js';
import ScoreModel from './score.model.js';

let sequelize;
if (dbConfig.dialect === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbConfig.storage,
    logging: false
  });
} else {
  sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
    logging: false
  });
}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Major = MajorModel(sequelize, Sequelize);
db.Course = CourseModel(sequelize, Sequelize);
db.Student = StudentModel(sequelize, Sequelize);
db.Score = ScoreModel(sequelize, Sequelize);

// Associations
// Major (1) <---> (N) Course
db.Major.hasMany(db.Course, { foreignKey: 'major_id', as: 'courses' });
db.Course.belongsTo(db.Major, { foreignKey: 'major_id', as: 'major' });

// Course (1) <---> (N) Score
db.Course.hasMany(db.Score, { foreignKey: 'course_id', as: 'scores' });
db.Score.belongsTo(db.Course, { foreignKey: 'course_id', as: 'course' });

// Student (1) <---> (N) Score
db.Student.hasMany(db.Score, { foreignKey: 'student_id', as: 'scores' });
db.Score.belongsTo(db.Student, { foreignKey: 'student_id', as: 'student' });

export default db;
