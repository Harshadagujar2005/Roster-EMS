const Employee = require('../models/Employee');
const ErrorResponse = require('../middleware/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Get all employees with search, department filter, sorting, and pagination
 * @route   GET /api/employees
 * @access  Private
 *
 * Query params:
 *   search     - search by full name (case-insensitive, partial match)
 *   department - filter by exact department
 *   sort       - 'fullName' (A-Z) or '-fullName' (Z-A). Defaults to '-createdAt'
 *   page        - page number, defaults to 1
 *   limit       - results per page, defaults to 10
 */
const getEmployees = asyncHandler(async (req, res) => {
  const { search, department, sort } = req.query;

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Build filter object
  const filter = {};

  if (search) {
    // Case-insensitive partial match on fullName
    filter.fullName = { $regex: search, $options: 'i' };
  }

  if (department) {
    filter.department = { $regex: `^${department}$`, $options: 'i' };
  }

  // Build sort object - default newest first
  let sortOption = { createdAt: -1 };
  if (sort === 'fullName') {
    sortOption = { fullName: 1 };
  } else if (sort === '-fullName') {
    sortOption = { fullName: -1 };
  }

  const [employees, total] = await Promise.all([
    Employee.find(filter).sort(sortOption).skip(skip).limit(limit),
    Employee.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: employees.length,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
    limit,
    data: employees,
  });
});

/**
 * @desc    Get a single employee by id
 * @route   GET /api/employees/:id
 * @access  Private
 */
const getEmployeeById = asyncHandler(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    return next(new ErrorResponse(`Employee not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: employee,
  });
});

/**
 * @desc    Create a new employee
 * @route   POST /api/employees
 * @access  Private
 */
const createEmployee = asyncHandler(async (req, res, next) => {
  const { fullName, email, mobileNumber, department, designation, joiningDate } = req.body;

  const existingEmployee = await Employee.findOne({ email });

  if (existingEmployee) {
    return next(new ErrorResponse('An employee with this email already exists', 400));
  }

  const employee = await Employee.create({
    fullName,
    email,
    mobileNumber,
    department,
    designation,
    joiningDate,
  });

  res.status(201).json({
    success: true,
    message: 'Employee created successfully',
    data: employee,
  });
});

/**
 * @desc    Update an existing employee
 * @route   PUT /api/employees/:id
 * @access  Private
 */
const updateEmployee = asyncHandler(async (req, res, next) => {
  let employee = await Employee.findById(req.params.id);

  if (!employee) {
    return next(new ErrorResponse(`Employee not found with id of ${req.params.id}`, 404));
  }

  // If email is being changed, ensure it's not already used by another employee
  if (req.body.email && req.body.email.toLowerCase() !== employee.email) {
    const existingEmployee = await Employee.findOne({ email: req.body.email.toLowerCase() });
    if (existingEmployee) {
      return next(new ErrorResponse('An employee with this email already exists', 400));
    }
  }

  const allowedFields = ['fullName', 'email', 'mobileNumber', 'department', 'designation', 'joiningDate'];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      employee[field] = req.body[field];
    }
  });

  await employee.save();

  res.status(200).json({
    success: true,
    message: 'Employee updated successfully',
    data: employee,
  });
});

/**
 * @desc    Delete an employee
 * @route   DELETE /api/employees/:id
 * @access  Private
 */
const deleteEmployee = asyncHandler(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    return next(new ErrorResponse(`Employee not found with id of ${req.params.id}`, 404));
  }

  await employee.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Employee deleted successfully',
    data: {},
  });
});

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
