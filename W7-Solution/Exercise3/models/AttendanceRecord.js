const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class AttendanceRecord extends Model { }

AttendanceRecord.init({
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('present', 'absent', 'late', 'excused'),
        defaultValue: 'present',
    },
}, {
    sequelize,
    modelName: 'AttendanceRecord',
});

module.exports = AttendanceRecord;
