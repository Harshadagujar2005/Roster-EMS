/**
 * Wraps an async route handler/controller and forwards any thrown errors
 * to Express's error handling middleware via next(), removing the need
 * for repetitive try/catch blocks in every controller function.
 *
 * @param {Function} fn - async (req, res, next) => {}
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
