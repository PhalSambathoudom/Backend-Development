export default (sequelize, Sequelize) => {
  const Major = sequelize.define('Major', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    code: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    tableName: 'majors',
    timestamps: true
  });

  return Major;
};
