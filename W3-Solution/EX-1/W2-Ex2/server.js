// server.js (Express refactor)
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.status(200).send(`
        <html>
            <head><title>Home</title></head>
            <body>
                <h1>Welcome to the Home Page</h1>
                <p>This is a simple Express.js server.</p>
            </body>
        </html>
    `);
});

app.get('/about', (req, res) => {
    res.type('text').send('About us: at CADT, we love node.js!');
});

app.get('/contact-us', (req, res) => {
    res.type('text').send('You can reach us via email...');
});

app.get('/products', (req, res) => {
    res.type('text').send('Buy one get one...');
});

app.get('/projects', (req, res) => {
    res.type('text').send('Here are our awesome projects');
});

// 404 handler
app.use((req, res) => {
    res.status(404).type('text').send('404 Not Found');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});