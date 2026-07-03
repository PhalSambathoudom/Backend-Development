const express = require('express');
const Student = require('../models/Student');
const Class = require('../models/Class');
const AttendanceRecord = require('../models/AttendanceRecord');

const router = express.Router();

// POST /attendance - Mark attendance for a student in a class on a given date
router.post('/attendance', async (req, res) => {
    try {
        const { studentId, classId, date, status = 'present' } = req.query;

        if (!studentId || !classId || !date) {
            return res.status(400).json({
                error: 'Missing required parameters: studentId, classId, date'
            });
        }

        const record = await AttendanceRecord.create({
            studentId: parseInt(studentId),
            classId: parseInt(classId),
            date,
            status
        });

        res.status(201).json({
            message: 'Attendance marked successfully',
            data: record
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /attendance - Get attendance for a student on a specific date
router.get('/attendance', async (req, res) => {
    try {
        const { studentId, date } = req.query;

        if (!studentId || !date) {
            return res.status(400).json({
                error: 'Missing required parameters: studentId, date'
            });
        }

        const records = await AttendanceRecord.findAll({
            where: { studentId: parseInt(studentId), date },
            include: [
                { model: Student, attributes: ['id', 'name'] },
                { model: Class, attributes: ['id', 'name', 'subject'] }
            ]
        });

        res.json({
            count: records.length,
            data: records
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /classes/:id/attendance - List attendance for all students in a class
router.get('/classes/:id/attendance', async (req, res) => {
    try {
        const { id } = req.params;
        const { date } = req.query;

        const where = { classId: parseInt(id) };
        if (date) where.date = date;

        const records = await AttendanceRecord.findAll({
            where,
            include: [
                { model: Student, attributes: ['id', 'name', 'email'] },
                { model: Class, attributes: ['id', 'name', 'subject'] }
            ],
            order: [['date', 'DESC']]
        });

        res.json({
            classId: parseInt(id),
            date: date || 'all dates',
            count: records.length,
            data: records
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /students/:id/attendance - Get attendance summary for a student
router.get('/students/:id/attendance', async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findByPk(parseInt(id));
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const records = await AttendanceRecord.findAll({
            where: { studentId: parseInt(id) },
            include: [
                { model: Class, attributes: ['id', 'name'] }
            ]
        });

        const summary = {};
        records.forEach(record => {
            const className = record.Class.name;
            if (!summary[className]) {
                summary[className] = {
                    total: 0,
                    present: 0,
                    absent: 0,
                    late: 0,
                    excused: 0
                };
            }
            summary[className].total++;
            summary[className][record.status]++;
        });

        res.json({
            studentId: parseInt(id),
            studentName: student.name,
            attendanceSummary: summary
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
