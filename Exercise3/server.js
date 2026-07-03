const express = require('express');
const sequelize = require('./config/database');
const Student = require('./models/Student');
const Class = require('./models/Class');
const AttendanceRecord = require('./models/AttendanceRecord');
const attendanceRoutes = require('./routes/attendance');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Define relationships
Student.hasMany(AttendanceRecord, { foreignKey: 'studentId' });
AttendanceRecord.belongsTo(Student, { foreignKey: 'studentId' });

Class.hasMany(AttendanceRecord, { foreignKey: 'classId' });
AttendanceRecord.belongsTo(Class, { foreignKey: 'classId' });

Student.belongsToMany(Class, {
    through: AttendanceRecord,
    foreignKey: 'studentId',
    otherKey: 'classId'
});

Class.belongsToMany(Student, {
    through: AttendanceRecord,
    foreignKey: 'classId',
    otherKey: 'studentId'
});

// Routes
app.use('/', attendanceRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

// Initialize database and start server
async function initializeAndStart() {
    try {
        await sequelize.sync({ force: true });
        console.log('✓ Database synchronized\n');

        // Create sample data
        console.log('Creating sample data...');
        const [student1, student2, student3] = await Student.bulkCreate([
            { name: 'Alice Johnson', email: 'alice@example.com' },
            { name: 'Bob Smith', email: 'bob@example.com' },
            { name: 'Charlie Brown', email: 'charlie@example.com' }
        ]);

        const [class1, class2] = await Class.bulkCreate([
            { name: 'Math 101', subject: 'Mathematics' },
            { name: 'History 101', subject: 'History' }
        ]);

        // Sample attendance records
        await AttendanceRecord.bulkCreate([
            { studentId: student1.id, classId: class1.id, date: '2025-06-17', status: 'present' },
            { studentId: student2.id, classId: class1.id, date: '2025-06-17', status: 'absent' },
            { studentId: student1.id, classId: class1.id, date: '2025-06-18', status: 'late' },
            { studentId: student1.id, classId: class2.id, date: '2025-06-17', status: 'present' }
        ]);

        console.log('✓ Sample data created\n');

        app.listen(PORT, () => {
            console.log(`✓ Server running at http://localhost:${PORT}`);
            console.log('\nAvailable endpoints:');
            console.log(`  POST   /attendance?studentId=1&classId=1&date=2025-06-17&status=present`);
            console.log(`  GET    /attendance?studentId=1&date=2025-06-17`);
            console.log(`  GET    /classes/1/attendance`);
            console.log(`  GET    /classes/1/attendance?date=2025-06-17`);
            console.log(`  GET    /students/1/attendance`);
            console.log(`  GET    /health`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}

initializeAndStart();
