require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('express-async-errors');
const connectDB = require('./config/db');
const mongoose = require('mongoose'); // for db check route

const app = express();

// ---------------------- MIDDLEWARE ----------------------
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: [
      'https://charity-donation-portal.vercel.app', // your frontend on Vercel
      'http://localhost:3000', // allow local dev too
    ],
    credentials: true,
  })
);

// ---------------------- BASIC TEST ROUTE ----------------------
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// ---------------------- ROUTES ----------------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/campaigns', require('./routes/campaigns'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/users', require('./routes/users'));

// ---------------------- DB CHECK ROUTE ----------------------
app.get('/api/dbcheck', async (req, res) => {
  try {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    const state = mongoose.connection.readyState;
    res.json({
      dbStatus: states[state],
      mongoURI: process.env.MONGODB_URI ? 'Loaded ✅' : 'Missing ❌',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
