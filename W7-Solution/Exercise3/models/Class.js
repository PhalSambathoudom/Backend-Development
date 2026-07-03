const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Class extends Model { }

Class.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Class',
});

module.exports = Class;
