const { Sequelize } = require('sequelize');

// Database configuration
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './attendance.db', // SQLite database file
    logging: false, // Set to console.log to see SQL queries
});

module.exports = sequelize;
