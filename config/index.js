
require('dotenv').config();

const config = {
  // Server configuration
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // API configuration
  apiVersion: process.env.API_VERSION || 'v1',
  
  // Authentication
  apiKeys: process.env.API_KEYS ? process.env.API_KEYS.split(',') : [
    'test-api-key-123',
    'admin-key-456',
    'user-key-789'
  ],
  
  // CORS configuration
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // Database (for future use)
  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/products-api',
    name: process.env.DATABASE_NAME || 'products_db'
  },
  
  // JWT (for future use)
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },
  
  // Rate limiting (for future use)
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  }
};

module.exports = config;
