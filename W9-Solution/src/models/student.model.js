export default (sequelize, Sequelize) => {
  const Student = sequelize.define('Student', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    full_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    gender: {
      type: Sequelize.STRING,
      allowNull: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, {
    tableName: 'students',
    timestamps: true
  });

  return Student;
};
