const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const usersFile = path.join(__dirname, 'users.txt');

// Read Users
app.get('/users', (req, res) => {
    fs.readFile(usersFile, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading users');
        const users = data ? JSON.parse(data) : [];
        res.json(users);
    });
});

// Register User
app.post('/register', (req, res) => {
    const { fullname, email, password } = req.body;

    fs.readFile(usersFile, 'utf8', (err, data) => {
        let users = data ? JSON.parse(data) : [];

        const exists = users.find(user => user.email === email);
        if (exists) return res.status(400).send('Email already registered');

        users.push({ fullname, email, password });

        fs.writeFile(usersFile, JSON.stringify(users), err => {
            if (err) return res.status(500).send('Error saving user');
            res.send('Registered Successfully');
        });
    });
});


// Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    fs.readFile(usersFile, 'utf8', (err, data) => {
        let users = data ? JSON.parse(data) : [];
        const userIndex = users.findIndex(u => u.email === email && u.password === password);

        if (userIndex === -1) return res.status(400).send('Invalid Credentials');

        // Set isLoggedIn = true
        users[userIndex].isLoggedIn = true;

        fs.writeFile(usersFile, JSON.stringify(users), err => {
            if (err) return res.status(500).send('Error saving login');
            res.send('Login Successful');
        });
    });
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




// Load All Events
app.get('/events', (req, res) => {
    const events = [
        {
            id: 1,
            title: "Chess Club Tournament",
            date: "April 25, 2025",
            location: "Library Hall - Room 101",
            description: "Join us for a friendly chess tournament open to all skill levels.",
            category: "Club",
            image: "/chess.jpg"
        },
        {
            id: 2,
            title: "Tech Talk: Future of AI",
            date: "April 28, 2025",
            location: "John Molson Auditorium",
            description: "A guest speaker discusses how AI will shape the future.",
            category: "Academic",
            image: "/tech.jpg"
        },
        {
            id: 3,
            title: "Spring Social BBQ",
            date: "May 2, 2025",
            location: "Loyola Campus - Backyard",
            description: "Free food, games, and networking with other students.",
            category: "Social",
            image: "/bbq.jpg"
        }
    ];

    res.json(events);
});


// Register to Event
app.post('/register-event', (req, res) => {
    const { email, eventId } = req.body;

    fs.readFile(usersFile, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading users');

        let users = data ? JSON.parse(data) : [];
        const userIndex = users.findIndex(u => u.email === email);

        if (userIndex === -1) return res.status(404).send('User not found');

        if (!users[userIndex].registeredEvents) {
            users[userIndex].registeredEvents = [];
        }

        if (users[userIndex].registeredEvents.includes(eventId)) {
            return res.status(400).send('Already Registered');
        }

        users[userIndex].registeredEvents.push(eventId);

        fs.writeFile(usersFile, JSON.stringify(users), err => {
            if (err) return res.status(500).send('Error saving registration');
            res.send('Event Registered Successfully');
        });
    });
});


// Fetch My Registered Events
app.get('/my-events/:email', (req, res) => {
    const { email } = req.params;

    fs.readFile(usersFile, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading users');

        let users = data ? JSON.parse(data) : [];
        const user = users.find(u => u.email === email);

        if (!user) return res.status(404).send('User not found');

        res.json(user.registeredEvents || []);
    });
});

// Cancel Registered Event
app.post('/cancel-event', (req, res) => {
    const { email, eventId } = req.body;

    fs.readFile(usersFile, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading users');

        let users = data ? JSON.parse(data) : [];
        const userIndex = users.findIndex(u => u.email === email);

        if (userIndex === -1) return res.status(404).send('User not found');

        users[userIndex].registeredEvents = users[userIndex].registeredEvents.filter(id => id !== eventId);

        fs.writeFile(usersFile, JSON.stringify(users), err => {
            if (err) return res.status(500).send('Error saving changes');
            res.send('Event Registration Cancelled');
        });
    });
});



app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
