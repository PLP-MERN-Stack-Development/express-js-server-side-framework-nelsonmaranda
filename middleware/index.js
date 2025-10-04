
const { v4: uuidv4 } = require('uuid');
const { AuthenticationError, ValidationError } = require('../utils/errors');

/**
 * Logger middleware - logs all requests with timestamp and request ID
 */
const loggerMiddleware = (req, res, next) => {
  const requestId = uuidv4().substring(0, 10);
  req.requestId = requestId;
  
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const userAgent = req.get('User-Agent') || 'Unknown';
  
  console.log(`[${timestamp}] ${method} ${url} - User-Agent: ${userAgent}`);
  console.log(`[${timestamp}] Request ID: ${requestId}`);
  
  next();
};

/**
 * JSON parser middleware - additional validation for JSON requests
 */
const jsonParserMiddleware = (req, res, next) => {
  if (req.is('application/json') && req.method !== 'GET') {
    try {
      if (req.body && typeof req.body === 'object') {
        // Additional JSON validation can be added here
        next();
      } else {
        next();
      }
    } catch (error) {
      next(new ValidationError('Invalid JSON format'));
    }
  } else {
    next();
  }
};

/**
 * Authentication middleware - validates API key
 */
const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
  
  if (!apiKey) {
    return next(new AuthenticationError('API key is required in X-API-Key header or Authorization header'));
  }
  
  const validApiKeys = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [
    'test-api-key-123',
    'admin-key-456', 
    'user-key-789'
  ];
  
  if (!validApiKeys.includes(apiKey)) {
    return next(new AuthenticationError('Invalid API key'));
  }
  
  // Set user info based on API key
  let userInfo = 'user-test (user)';
  if (apiKey === 'admin-key-456') {
    userInfo = 'admin-user (admin)';
  } else if (apiKey === 'user-key-789') {
    userInfo = 'regular-user (user)';
  }
  
  console.log(`Authenticated user: ${userInfo}`);
  req.user = { apiKey, userInfo };
  
  next();
};

/**
 * Product creation validation middleware
 */
const validateProductCreation = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  const errors = [];
  
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }
  
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.push('Description is required and must be a non-empty string');
  }
  
  if (price === undefined || price === null || typeof price !== 'number' || price < 0) {
    errors.push('Price is required and must be a non-negative number');
  }
  
  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    errors.push('Category is required and must be a non-empty string');
  }
  
  if (typeof inStock !== 'boolean') {
    errors.push('InStock is required and must be a boolean');
  }
  
  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }
  
  next();
};

/**
 * Product update validation middleware
 */
const validateProductUpdate = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  const errors = [];
  
  if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
    errors.push('Name must be a non-empty string');
  }
  
  if (description !== undefined && (typeof description !== 'string' || description.trim().length === 0)) {
    errors.push('Description must be a non-empty string');
  }
  
  if (price !== undefined && (typeof price !== 'number' || price < 0)) {
    errors.push('Price must be a non-negative number');
  }
  
  if (category !== undefined && (typeof category !== 'string' || category.trim().length === 0)) {
    errors.push('Category must be a non-empty string');
  }
  
  if (inStock !== undefined && typeof inStock !== 'boolean') {
    errors.push('InStock must be a boolean');
  }
  
  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }
  
  next();
};

/**
 * Global error handling middleware
 */
const errorHandlerMiddleware = (err, req, res, next) => {
  console.error(`Error in request ${req.requestId}:`, err);
  
  // Default error
  let error = {
    error: err.message || 'Internal Server Error',
    statusCode: err.statusCode || 500,
    timestamp: new Date().toISOString(),
    requestId: req.requestId
  };
  
  // Add additional error details
  if (err.details) {
    error.details = err.details;
  }
  
  if (err.resource) {
    error.resource = err.resource;
  }
  
  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    error.error = 'Something went wrong';
  }
  
  res.status(error.statusCode).json(error);
};

/**
 * 404 Not Found middleware
 */
const notFoundMiddleware = (req, res, next) => {
  const error = new Error(`Route: Route ${req.method} ${req.originalUrl} not found`);
  error.statusCode = 404;
  error.resource = 'Route';
  next(error);
};

module.exports = {
  loggerMiddleware,
  jsonParserMiddleware,
  authMiddleware,
  validateProductCreation,
  validateProductUpdate,
  errorHandlerMiddleware,
  notFoundMiddleware
};
