// server.js (Express refactor)
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse URL-encoded form bodies
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.type('text').send('Welcome to the Home Page');
});

app.get('/contact', (req, res) => {
    res.type('html').send(`
        <h1>Contact Form</h1>
        <form method="POST" action="/contact">
            <input type="text" name="name" placeholder="Your name" />
            <button type="submit">Submit</button>
        </form>
    `);
});

app.post('/contact', (req, res) => {
    const name = (req.body && req.body.name) ? req.body.name.toString().trim() : '';

    console.log('Submitted Name:', name);

    if (!name) {
        return res.status(400).type('text').send('Name cannot be empty');
    }

    const filePath = path.join(__dirname, 'submissions.txt');
    fs.appendFile(filePath, name + '\n', (err) => {
        if (err) {
            console.error('Error saving submission', err);
            return res.status(500).type('text').send('Error saving submission');
        }

        res.type('html').send(`
            <h1>Submission Successful</h1>
            <p>Thank you, ${name}!</p>
            <a href="/contact">Go Back</a>
        `);
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).type('text').send('404 Not Found');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});