const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const pool = require('../db'); // PostgreSQL connection

const app = express();
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Setup multer for image parsing
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ========== USER ROUTES ==========

// 🔁 New REGISTER route using PostgreSQL
app.post('/register', async (req, res) => {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    try {
        const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (existing.rows.length > 0) {
            return res.status(400).json({ message: "Email already registered." });
        }

        await pool.query(
            'INSERT INTO users (fullname, email, password) VALUES ($1, $2, $3)',
            [fullname, email, password]
        );

        res.json({ message: "Account created successfully!" });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: "Database error during registration." });
    }
});

// Still using users.txt for logout/login (optional to convert to DB later)
const usersFile = path.join(__dirname, 'users.txt');


// ✅ Clear all login states on server start
fs.readFile(usersFile, 'utf8', (err, data) => {
  if (!err && data) {
    const users = JSON.parse(data).map(user => ({
      ...user,
      isLoggedIn: false
    }));

    fs.writeFile(usersFile, JSON.stringify(users), err => {
      if (err) console.error("❌ Failed to reset login states:", err);
      else console.log("✅ All users logged out on server start.");
    });
  }
});


app.get('/users', (req, res) => {
    fs.readFile(usersFile, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading users');
        const users = data ? JSON.parse(data) : [];
        res.json(users);
    });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Missing email or password');
    }

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1 AND password = $2',
            [email, password]
        );

        if (result.rows.length === 0) {
            return res.status(400).send('Invalid Credentials');
        }

        res.send('Login Successful');
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).send('Database error');
    }
});


app.post('/logout', (req, res) => {
    const { email } = req.body;

    fs.readFile(usersFile, 'utf8', (err, data) => {
        let users = data ? JSON.parse(data) : [];
        const userIndex = users.findIndex(u => u.email === email);

        if (userIndex === -1) return res.status(404).send('User not found');

        users[userIndex].isLoggedIn = false;

        fs.writeFile(usersFile, JSON.stringify(users), err => {
            if (err) return res.status(500).send('Error saving logout');
            res.send('Logged out successfully');
        });
    });
});

// ========== EVENT ROUTES ==========

app.post('/submit-event', upload.single('image'), async (req, res) => {
    try {
        const formData = JSON.parse(req.body.data);
        const { title, description, location, date, time, organizer, category } = formData;
        const imageName = req.file ? req.file.originalname : 'empty.png';

        await pool.query(
            `INSERT INTO events (title, description, location, date, time, organizer, category, image)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [title, description, location, date, time, organizer, category, `/images/${imageName}`]
        );

        res.json({ message: 'Event submitted successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

app.get('/events', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM events ORDER BY date ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching events');
    }
});

app.post('/register-event', async (req, res) => {
    const { email, eventId } = req.body;

    try {
        const exists = await pool.query(
            'SELECT * FROM registrations WHERE user_email = $1 AND event_id = $2',
            [email, eventId]
        );

        if (exists.rows.length > 0) {
            return res.status(400).send('Already Registered');
        }

        await pool.query(
            'INSERT INTO registrations (user_email, event_id) VALUES ($1, $2)',
            [email, eventId]
        );

        res.send('Event Registered Successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

app.get('/my-events/:email', async (req, res) => {
    const email = req.params.email;

    try {
        const result = await pool.query(
            `SELECT e.* FROM registrations r
             JOIN events e ON r.event_id = e.id
             WHERE r.user_email = $1`, [email]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching registered events");
    }
});

app.post('/cancel-event', async (req, res) => {
    const { email, eventId } = req.body;

    try {
        await pool.query(
            'DELETE FROM registrations WHERE user_email = $1 AND event_id = $2',
            [email, eventId]
        );

        res.send('Event Registration Cancelled');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error canceling registration");
    }
});

// Health check for DB connection
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ connected: true, time: result.rows[0].now });
    } catch (err) {
        console.error('DB Connection Error:', err);
        res.status(500).json({ connected: false });
    }
});

// Start server
app.listen(3001, () => {
    console.log('✅ Server running on http://localhost:3001');
});
