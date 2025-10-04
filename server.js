
// Load environment variables
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import configuration
const config = require('./config');

// Import middleware
const {
  loggerMiddleware,
  jsonParserMiddleware,
  errorHandlerMiddleware,
  notFoundMiddleware
} = require('./middleware');

// Import routes
const apiRoutes = require('./routes');

// Create Express app
const app = express();

// Trust proxy (for production deployment)
app.set('trust proxy', 1);

// CORS configuration
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));

// Global middleware
app.use(loggerMiddleware);
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(jsonParserMiddleware);

// API routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Hello World! Welcome to the Products API',
    version: config.apiVersion,
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    endpoints: {
      api: '/api',
      health: '/api/health',
      docs: '/api/docs',
      products: '/api/products'
    }
  });
});

// 404 handler (must be after all routes)
app.use(notFoundMiddleware);

// Global error handler (must be last)
app.use(errorHandlerMiddleware);

// Start server
const PORT = config.port;
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`Available API Keys: ${config.apiKeys.join(', ')}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
  console.log('Use X-API-Key header for authentication on protected routes');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = app;