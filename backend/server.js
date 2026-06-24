const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// ---------- Global Middleware ----------

// Enable CORS
const clientOrigin = process.env.CLIENT_ORIGIN || '*';
app.use(
  cors({
    origin: clientOrigin === '*' ? '*' : clientOrigin.split(',').map((o) => o.trim()),
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logger (helpful during development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });
}

// ---------- Health check ----------
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Employee Management System API is running',
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, status: 'OK', timestamp: new Date().toISOString() });
});

// ---------- API Routes ----------
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

// ---------- Error Handling ----------
// 404 handler for undefined routes
app.use(notFound);

// Centralized error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
