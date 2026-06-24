const ErrorResponse = require('./errorResponse');

/**
 * Centralized error handling middleware. Catches errors forwarded via
 * next(err) from anywhere in the app (including asyncHandler-wrapped
 * controllers) and formats them into a consistent JSON response.
 * Must be registered AFTER all routes in server.js.
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Ensure we are working with an object that has message/statusCode
  if (!(error instanceof ErrorResponse)) {
    error = new ErrorResponse(err.message || 'Server Error', err.statusCode || 500);
    error.stack = err.stack;
  }

  // Log full error in development for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  // Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError') {
    error = new ErrorResponse(`Resource not found with id of ${err.value}`, 404);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error = new ErrorResponse(
      `Duplicate value entered for '${field}'. Please use another value.`,
      400
    );
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(messages.join('. '), 400);
  }

  // JSON Web Token errors
  if (err.name === 'JsonWebTokenError') {
    error = new ErrorResponse('Invalid token. Please log in again.', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new ErrorResponse('Your token has expired. Please log in again.', 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
  });
};

/**
 * Handles requests to undefined routes (404 Not Found).
 */
const notFound = (req, res, next) => {
  const error = new ErrorResponse(`Route not found: ${req.originalUrl}`, 404);
  next(error);
};

module.exports = { errorHandler, notFound };
