
/**
 * Base application error class
 */
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404 Not Found Error
 */
class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource}: ${resource} not found`, 404);
    this.resource = resource;
  }
}

/**
 * 400 Bad Request Error
 */
class ValidationError extends AppError {
  constructor(message = 'Validation failed', details = []) {
    super(message, 400);
    this.details = details;
  }
}

/**
 * 401 Unauthorized Error
 */
class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401);
  }
}

/**
 * 403 Forbidden Error
 */
class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403);
  }
}

/**
 * 409 Conflict Error
 */
class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
  }
}

/**
 * 500 Internal Server Error
 */
class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, 500);
  }
}

/**
 * Async error handler wrapper
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Wrapped function with error handling
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  AppError,
  NotFoundError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  ConflictError,
  InternalServerError,
  asyncHandler
};
