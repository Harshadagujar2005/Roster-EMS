const express = require('express');
const router = express.Router();

const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');

const { protect } = require('../middleware/auth');
const {
  employeeValidationRules,
  employeeUpdateValidationRules,
  employeeQueryValidationRules,
  handleValidationErrors,
} = require('../middleware/validators');

// All employee routes require a valid JWT
router.use(protect);

// @route   GET /api/employees       - list employees (search, filter, sort, paginate)
// @route   POST /api/employees      - create employee
router
  .route('/')
  .get(employeeQueryValidationRules, handleValidationErrors, getEmployees)
  .post(employeeValidationRules, handleValidationErrors, createEmployee);

// @route   GET /api/employees/:id   - get single employee
// @route   PUT /api/employees/:id   - update employee
// @route   DELETE /api/employees/:id - delete employee
router
  .route('/:id')
  .get(getEmployeeById)
  .put(employeeUpdateValidationRules, handleValidationErrors, updateEmployee)
  .delete(deleteEmployee);

module.exports = router;
