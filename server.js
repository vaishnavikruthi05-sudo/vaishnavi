const express = require('express');
const cors = require('cors');
require('express-async-errors');
const mongoose = require('mongoose');

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

// ---------------- Debug log for Render ----------------
console.log('MONGODB_URI (Render env):', process.env.MONGODB_URI);
console.log('JWT_SECRET (Render env):', process.env.JWT_SECRET);
console.log('PORT (Render env):', process.env.PORT);

// ---------------- Test Route ----------------
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// ---------------- DB Check Route ----------------
app.get('/api/dbcheck', async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    dbStatus: states[dbState],
    mongoURI: process.env.MONGODB_URI ? 'Loaded ✅' : 'Not set ❌',
  });
});

// ---------------- ENV Check Route ----------------
app.get('/api/envcheck', (req, res) => {
  res.json({
    mongodb_uri: process.env.MONGODB_URI ? 'Loaded ✅' : 'Not set on Render ❌',
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
app.use(require('./middleware/errorHandler'));

// ---------------- Connect DB ----------------
(async () => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.error('❌ MONGODB_URI is not set! Please add it in Render dashboard.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI, {
      dbName: 'charitydb',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
})();

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
