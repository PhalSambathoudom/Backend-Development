const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Student extends Model { }

Student.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    sequelize,
    modelName: 'Student',
});

module.exports = Student;
