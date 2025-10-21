require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('express-async-errors');
const connectDB = require('./config/db');

const app = express();

// ---------------- Middleware ----------------
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// ---------------- Test Routes ----------------
app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.get('/api/dbcheck', async (req, res) => {
  try {
    const mongoose = require('mongoose');
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

// ---------------- Main Routes ----------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/campaigns', require('./routes/campaigns'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/users', require('./routes/users'));

// ---------------- Error Handler ----------------
app.use(require('./middleware/errorHandler'
