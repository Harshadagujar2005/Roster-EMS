import React, { useEffect, useState } from 'react';
import { DEPARTMENTS, EMAIL_REGEX, MOBILE_REGEX } from '../utils/constants';
import './EmployeeForm.css';

const EMPTY_FORM = {
  fullName: '',
  email: '',
  mobileNumber: '',
  department: '',
  designation: '',
  joiningDate: '',
};

const validate = (values) => {
  const errors = {};

  if (!values.fullName.trim()) {
    errors.fullName = 'Full name is required.';
  } else if (values.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.mobileNumber.trim()) {
    errors.mobileNumber = 'Mobile number is required.';
  } else if (!MOBILE_REGEX.test(values.mobileNumber.trim())) {
    errors.mobileNumber = 'Enter a valid phone number (digits, spaces, +, -, parentheses).';
  }

  if (!values.department.trim()) {
    errors.department = 'Select a department.';
  }

  if (!values.designation.trim()) {
    errors.designation = 'Designation is required.';
  }

  if (!values.joiningDate) {
    errors.joiningDate = 'Joining date is required.';
  }

  return errors;
};

/**
 * @param {{
 *   initialValues?: object,
 *   submitLabel?: string,
 *   busy?: boolean,
 *   serverError?: string,
 *   onSubmit: (values: object) => void,
 *   onCancel?: () => void,
 * }} props
 */
const EmployeeForm = ({ initialValues, submitLabel = 'Save employee', busy = false, serverError = '', onSubmit, onCancel }) => {
  const [values, setValues] = useState({ ...EMPTY_FORM, ...initialValues });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialValues) {
      setValues((current) => ({ ...current, ...initialValues }));
    }
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
    setErrors(validate(values));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setTouched({
      fullName: true,
      email: true,
      mobileNumber: true,
      department: true,
      designation: true,
      joiningDate: true,
    });

    if (Object.keys(validationErrors).length === 0) {
      onSubmit({ ...values, fullName: values.fullName.trim(), email: values.email.trim().toLowerCase() });
    }
  };

  const showError = (field) => touched[field] && errors[field];

  return (
    <form className="employee-form" onSubmit={handleSubmit} noValidate>
      {serverError && (
        <div className="banner banner-error" role="alert">
          <span className="banner-icon" aria-hidden="true">⚠</span>
          <span>{serverError}</span>
        </div>
      )}

      <div className="form-grid">
        <div className="field">
          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="e.g. Priya Sharma"
            value={values.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={showError('fullName') ? 'has-error' : ''}
            aria-invalid={Boolean(showError('fullName'))}
          />
          {showError('fullName') && <span className="error-text">{errors.fullName}</span>}
        </div>

        <div className="field">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="priya.sharma@company.com"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={showError('email') ? 'has-error' : ''}
            aria-invalid={Boolean(showError('email'))}
          />
          {showError('email') && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="field">
          <label htmlFor="mobileNumber">Mobile number</label>
          <input
            id="mobileNumber"
            name="mobileNumber"
            type="tel"
            placeholder="+1 202 555 0173"
            value={values.mobileNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            className={showError('mobileNumber') ? 'has-error' : ''}
            aria-invalid={Boolean(showError('mobileNumber'))}
          />
          {showError('mobileNumber') && <span className="error-text">{errors.mobileNumber}</span>}
        </div>

        <div className="field">
          <label htmlFor="department">Department</label>
          <select
            id="department"
            name="department"
            value={values.department}
            onChange={handleChange}
            onBlur={handleBlur}
            className={showError('department') ? 'has-error' : ''}
            aria-invalid={Boolean(showError('department'))}
          >
            <option value="">Select a department</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          {showError('department') && <span className="error-text">{errors.department}</span>}
        </div>

        <div className="field">
          <label htmlFor="designation">Designation</label>
          <input
            id="designation"
            name="designation"
            type="text"
            placeholder="e.g. Senior Software Engineer"
            value={values.designation}
            onChange={handleChange}
            onBlur={handleBlur}
            className={showError('designation') ? 'has-error' : ''}
            aria-invalid={Boolean(showError('designation'))}
          />
          {showError('designation') && <span className="error-text">{errors.designation}</span>}
        </div>

        <div className="field">
          <label htmlFor="joiningDate">Joining date</label>
          <input
            id="joiningDate"
            name="joiningDate"
            type="date"
            value={values.joiningDate}
            onChange={handleChange}
            onBlur={handleBlur}
            className={showError('joiningDate') ? 'has-error' : ''}
            aria-invalid={Boolean(showError('joiningDate'))}
          />
          {showError('joiningDate') && <span className="error-text">{errors.joiningDate}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default EmployeeForm;
