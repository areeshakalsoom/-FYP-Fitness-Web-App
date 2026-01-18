const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');
// Load env vars
dotenv.config(
  {
    path: path.join(__dirname, '.env'),
  }
);

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/meals', require('./routes/meals'));
app.use('/api/workout-plans', require('./routes/workoutPlans'));
app.use('/api/diet-plans', require('./routes/dietPlans'));
app.use('/api/medical-records', require('./routes/medicalRecords'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/weight', require('./routes/weight'));
app.use('/api/admin', require('./routes/admin'));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Health & Fitness Tracker API is running',
    timestamp: new Date().toISOString(),
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5002;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Error: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
