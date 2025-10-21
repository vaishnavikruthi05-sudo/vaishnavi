require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('express-async-errors');
const connectDB = require('./config/db');
const mongoose = require('mongoose'); // for dbcheck route

const app = express();

// ---------------- Middleware ----------------
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: [
      'https://charity-donation-portal.vercel.app', // frontend URL
      'http://localhost:3000', // local dev
    ],
    credentials: true,
  })
);

// ---------------- Test Routes ----------------
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// ---------------- DB Check Route ----------------
app.get('/api/dbcheck', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    res.json({
      dbStatus: states[dbState],
      mongoURI: process.env.MONGODB_URI ? 'Loaded ✅' : 'Missing ❌',
    });
  } catch (err) {
    res.status(500).json({ error: 'DB check failed', details: err.message });
  }
});

// ---------------- ENV Check Route (TEMP) ----------------
app.get('/api/envcheck', (req, res) => {
  res.json({
    mongodb_uri: process.env.MONGODB_URI ? 'Loaded ✅' : 'Missing ❌',
    jwt_secret: process.env.JWT_SECRET ? 'Loaded ✅' : 'Missing ❌',
    port: process.env.PORT ? process.env.PORT : 'Default 5000',
  });
});

// ---------------- Main Routes ----------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/campaigns', require('./routes/campaigns'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/users', require('./routes/users'));

// ---------------- Error Handler ----------------
app.use(require('./middleware/errorHandler')); // ✅ fixed parenthesis

// ---------------- Connect DB ----------------
connectDB();

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
