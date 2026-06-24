const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('./errorResponse');
const asyncHandler = require('./asyncHandler');

/**
 * Protects routes by verifying the JWT sent in the Authorization header
 * (format: "Bearer <token>"). On success, attaches the authenticated
 * user document (without password) to req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return next(
      new ErrorResponse('Not authorized to access this route. No token provided.', 401)
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorResponse('User belonging to this token no longer exists.', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route. Invalid or expired token.', 401));
  }
});

module.exports = { protect };
