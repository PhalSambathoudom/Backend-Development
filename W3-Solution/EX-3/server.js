import express from 'express';
import course from './course.js';

// Import middleware
import logger from './middleware/logger.js';
import validateQuery from './middleware/validateQuery.js';
import auth from './middleware/auth.js';

const app = express();
const PORT = 3000;

// --- Q1: Apply logger globally (all routes) ---
app.use(logger);

// --- Q3: Apply auth globally (all routes) ---
app.use(auth);

// --- Q1 + Q2 + Q3: Main route with validateQuery middleware ---
app.get('/departments/:dept/courses', validateQuery, (req, res) => {
    const { dept } = req.params;
    const { level, minCredits, maxCredits, semester, instructor } = req.query;

    const min = minCredits !== undefined ? parseInt(minCredits) : null;
    const max = maxCredits !== undefined ? parseInt(maxCredits) : null;

    const results = course.filter(c => {
        if (c.department.toLowerCase() !== dept.toLowerCase()) return false;
        if (level && c.level !== level) return false;
        if (min !== null && c.credits < min) return false;
        if (max !== null && c.credits > max) return false;
        if (semester && c.semester !== semester) return false;
        if (instructor && !c.instructor.toLowerCase().includes(instructor.toLowerCase())) return false;
        return true;
    });

    if (results.length === 0) {
        return res.status(404).json({
            results: [],
            meta: { total: 0 },
            message: 'No courses found matching the given criteria.'
        });
    }

    return res.status(200).json({
        results,
        meta: { total: results.length }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});