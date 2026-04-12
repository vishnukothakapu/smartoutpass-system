require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const outpassRoutes = require('./routes/outpasses');
const logRoutes = require('./routes/logs');

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ 
  origin: function(origin, callback) {
    // Allow all origins for production since Vercel domains are dynamic
    callback(null, true);
  }, 
  credentials: true 
}));
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/outpasses', outpassRoutes);
app.use('/api/logs', logRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error.' });
});

// ─── Database Connection ──────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smartoutpass';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected.');
    app.listen(PORT, () => {
      console.log(`🚀 Backend running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
