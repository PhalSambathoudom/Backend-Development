export default (sequelize, Sequelize) => {
  const Course = sequelize.define('Course', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    credit: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 3
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'active'
    },
    major_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'courses',
    timestamps: true
  });

  return Course;
};
