require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'ahonna_secure_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// MySQL Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'drakelim115',
    database: process.env.DB_NAME || 'ahonna_db'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log(`Connected to MySQL database: ${process.env.DB_NAME || 'ahonna_db'}`);
});

// --- API ROUTES: EVACUATION CENTERS ---
app.get('/api/evacuation-centers', (req, res) => {
    db.query('SELECT * FROM evacuation_centers', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// --- API ROUTES: AUTHENTICATION (COMPONENT A) ---

// Register Route
app.post('/api/register', async (req, res) => {
    const { fullname, email, password, contact_number } = req.body;

    if (!fullname || !email || !password || !contact_number) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.error("DB Select Error:", err);
                return res.status(500).json({ error: 'Database select error: ' + err.message });
            }
            if (results.length > 0) {
                return res.status(400).json({ error: 'Email is already registered.' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert new user
            const query = 'INSERT INTO users (fullname, email, password, contact_number) VALUES (?, ?, ?, ?)';
            db.query(query, [fullname, email, hashedPassword, contact_number], (err, result) => {
                if (err) {
                    console.error("DB Insert Error:", err);
                    return res.status(500).json({ error: 'Database insert error: ' + err.message });
                }
                res.json({ success: true, message: 'Registration successful! You can now log in.' });
            });
        });
    } catch (err) {
        console.error("Server Catch Error:", err);
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

// Login Route
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.error("DB Login Error:", err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        const user = results.results ? results.results[0] : results[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        // Save session
        req.session.user = {
            id: user.id,
            fullname: user.fullname,
            email: user.email,
            contact_number: user.contact_number
        };

        res.json({ success: true, message: 'Logged in successfully!', user: req.session.user });
    });
});

// Check Current Session Route
app.get('/api/current-user', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// Logout Route
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Could not log out.' });
        res.clearCookie('connect.sid');
        res.json({ success: true, message: 'Logged out successfully.' });
    });
});

// --- API ROUTES: PAYMONGO CHECKOUT (COMPONENT C) ---
app.post('/api/create-checkout', async (req, res) => {
    const { amount, description } = req.body;

    if (!amount) {
        return res.status(400).json({ error: 'Amount is required for checkout.' });
    }

    const paymongoKey = process.env.PAYMONGO_SECRET_KEY;
    if (!paymongoKey) {
        return res.status(500).json({ error: 'PayMongo secret key is not configured.' });
    }

    try {
        const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: 'Basic ' + Buffer.from(paymongoKey).toString('base64'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: {
                    attributes: {
                        billing: {
                            name: req.session.user ? req.session.user.fullname : 'Guest Donor',
                            email: req.session.user ? req.session.user.email : 'guest@ahonna.com',
                            phone: req.session.user ? req.session.user.contact_number : '09123456789'
                        },
                        line_items: [
                            {
                                currency: 'PHP',
                                amount: parseInt(amount) * 100, // Convert PHP to centavos
                                name: description || 'AhonNa Emergency Relief Donation',
                                quantity: 1
                            }
                        ],
                        payment_method_types: ['card', 'gcash', 'paymaya'],
                        success_url: 'http://localhost:3000/?payment=success',
                        cancel_url: 'http://localhost:3000/?payment=cancelled'
                    }
                }
            })
        });

        const data = await response.json();
        
        if (data.errors || !data.data) {
            return res.status(400).json({ error: data.errors ? data.errors[0].detail : 'Failed to create checkout session.' });
        }

        res.json({ success: true, checkout_url: data.data.attributes.checkout_url });
    } catch (err) {
        console.error("PayMongo Error:", err);
        res.status(500).json({ error: 'Server error during checkout initialization.' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`AhonNa Server running at http://localhost:${PORT}`);
});