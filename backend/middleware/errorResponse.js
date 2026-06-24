/**
 * Custom error class that carries an HTTP status code along with the
 * error message. Used throughout controllers to trigger consistent
 * error responses via the centralized error handling middleware.
 */
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse;
