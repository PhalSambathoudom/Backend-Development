import express from 'express';
import course from './course.js';

const app = express();
const PORT = 3000;

// Route: GET /departments/:dept/courses
app.get('/departments/:dept/courses', (req, res) => {
    const { dept } = req.params;
    const { level, minCredits, maxCredits, semester, instructor } = req.query;

    // --- Q4: Validate credit range before filtering ---
    const min = minCredits !== undefined ? parseInt(minCredits) : null;
    const max = maxCredits !== undefined ? parseInt(maxCredits) : null;

    if (min !== null && max !== null && min > max) {
        return res.status(400).json({
            error: 'Invalid credit range: minCredits cannot be greater than maxCredits.'
        });
    }

    // --- Q2 & Q3: Filter logic ---
    const results = course.filter(c => {

        // Q1: Match route param :dept (case-insensitive)
        if (c.department.toLowerCase() !== dept.toLowerCase()) return false;

        // Filter by level (exact match)
        if (level && c.level !== level) return false;

        // Filter by minCredits
        if (min !== null && c.credits < min) return false;

        // Filter by maxCredits
        if (max !== null && c.credits > max) return false;

        // Filter by semester (exact match)
        if (semester && c.semester !== semester) return false;

        // Filter by instructor (partial match, case-insensitive)
        if (instructor && !c.instructor.toLowerCase().includes(instructor.toLowerCase())) return false;

        return true; // Course passed all filters
    });

    // --- Q4: No matching courses ---
    if (results.length === 0) {
        return res.status(404).json({
            results: [],
            meta: { total: 0 },
            message: 'No courses found matching the given criteria.'
        });
    }

    // --- Q3: Return matched courses + meta ---
    return res.status(200).json({
        results,
        meta: { total: results.length }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});