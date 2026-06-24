const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  registerValidationRules,
  loginValidationRules,
  handleValidationErrors,
} = require('../middleware/validators');

// @route   POST /api/auth/register
router.post('/register', registerValidationRules, handleValidationErrors, registerUser);

// @route   POST /api/auth/login
router.post('/login', loginValidationRules, handleValidationErrors, loginUser);

// @route   GET /api/auth/me  (bonus: protected route to fetch logged-in user profile)
router.get('/me', protect, getMe);

module.exports = router;
