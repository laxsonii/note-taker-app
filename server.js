const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (e.g., HTML, CSS, client-side JS)
app.use(express.static('public'));

// API routes
// GET existing notes
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, 'db', 'notes.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
            return;
        }
        res.json(JSON.parse(data));
    });
});

// POST a new note
app.post('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, 'db', 'notes.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
            return;
        }
        const notes = JSON.parse(data);
        const newNote = {
            id: uuidv4(),
            title: req.body.title,
            text: req.body.text
        };
        notes.push(newNote);
        fs.writeFile(path.join(__dirname, 'db', 'notes.json'), JSON.stringify(notes, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: 'Server error' });
                return;
            }
            res.json(newNote);
        });
    });
});

// DELETE a note by ID
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    fs.readFile(path.join(__dirname, 'db', 'notes.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
            return;
        }
        let notes = JSON.parse(data);
        notes = notes.filter(note => note.id !== noteId);
        fs.writeFile(path.join(__dirname, 'db', 'notes.json'), JSON.stringify(notes, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: 'Server error' });
                return;
            }
            res.json({ message: 'Note deleted' });
        });
    });
});

// Serve index.html for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
