const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters long'],
      maxlength: [150, 'Full name cannot exceed 150 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
      match: [
        /^[0-9+\-\s()]{7,20}$/,
        'Please provide a valid mobile number',
      ],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
    },
    joiningDate: {
      type: Date,
      required: [true, 'Joining date is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Helpful indexes for search, filtering, and sorting
employeeSchema.index({ fullName: 'text' });
employeeSchema.index({ department: 1 });

module.exports = mongoose.model('Employee', employeeSchema);
