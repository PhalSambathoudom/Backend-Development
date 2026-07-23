export default (sequelize, Sequelize) => {
  const Score = sequelize.define('Score', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    score: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    academic_year: {
      type: Sequelize.STRING,
      allowNull: false
    },
    student_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    course_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'scores',
    timestamps: true
  });

  return Score;
};
