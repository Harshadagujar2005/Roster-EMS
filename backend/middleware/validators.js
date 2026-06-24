const { body, query, validationResult } = require('express-validator');
const ErrorResponse = require('./errorResponse');

/**
 * Checks the results collected by express-validator's validation chains.
 * If any validation errors exist, forwards a formatted 400 error to the
 * centralized error handler. Otherwise, passes control to the next
 * middleware/controller.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return next(new ErrorResponse(messages.join('. '), 400));
  }

  next();
};

// ---------- Auth validation rules ----------

const registerValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

const loginValidationRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// ---------- Employee validation rules ----------

const employeeValidationRules = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 150 })
    .withMessage('Full name must be between 2 and 150 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('mobileNumber')
    .trim()
    .notEmpty()
    .withMessage('Mobile number is required')
    .matches(/^[0-9+\-\s()]{7,20}$/)
    .withMessage('Please provide a valid mobile number'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('designation').trim().notEmpty().withMessage('Designation is required'),
  body('joiningDate')
    .notEmpty()
    .withMessage('Joining date is required')
    .isISO8601()
    .withMessage('Joining date must be a valid date (YYYY-MM-DD)'),
];

// Used for PUT/update - fields are optional but validated when present
const employeeUpdateValidationRules = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('Full name must be between 2 and 150 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('mobileNumber')
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]{7,20}$/)
    .withMessage('Please provide a valid mobile number'),
  body('department').optional().trim().notEmpty().withMessage('Department cannot be empty'),
  body('designation').optional().trim().notEmpty().withMessage('Designation cannot be empty'),
  body('joiningDate')
    .optional()
    .isISO8601()
    .withMessage('Joining date must be a valid date (YYYY-MM-DD)'),
];

const employeeQueryValidationRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sort')
    .optional()
    .isIn(['fullName', '-fullName'])
    .withMessage("Sort must be 'fullName' or '-fullName'"),
];

module.exports = {
  handleValidationErrors,
  registerValidationRules,
  loginValidationRules,
  employeeValidationRules,
  employeeUpdateValidationRules,
  employeeQueryValidationRules,
};
