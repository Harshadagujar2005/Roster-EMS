import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { EMAIL_REGEX } from '../utils/constants';
import './AuthLayout.css';

const validate = (values) => {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = 'Name is required.';
  } else if (values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.password) {
    errors.password = 'Password is required.';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
};

const Register = () => {
  const { register } = useAuth();
  const { showSuccess } = useToast();
  const navigate = useNavigate();

  const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleBlur = (event) => {
    setTouched((current) => ({ ...current, [event.target.name]: true }));
    setErrors(validate(values));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    setServerError('');

    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      await register({ name: values.name.trim(), email: values.email.trim(), password: values.password });
      showSuccess('Account created — welcome to Roster.');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setServerError(error.message || 'Unable to create your account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const showError = (field) => touched[field] && errors[field];

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-badge" aria-hidden="true">R</div>
        <span className="eyebrow">Roster · Create account</span>
        <h1>Set up your access</h1>
        <span className="auth-subtitle">Create an account to start managing employee records.</span>

        {serverError && (
          <div className="banner banner-error" role="alert">
            <span className="banner-icon" aria-hidden="true">⚠</span>
            <span>{serverError}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="e.g. Alex Carter"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={showError('name') ? 'has-error' : ''}
              aria-invalid={Boolean(showError('name'))}
            />
            {showError('name') && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={showError('email') ? 'has-error' : ''}
              aria-invalid={Boolean(showError('email'))}
            />
            {showError('email') && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 6 characters"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={showError('password') ? 'has-error' : ''}
              aria-invalid={Boolean(showError('password'))}
            />
            {showError('password') && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="field">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={showError('confirmPassword') ? 'has-error' : ''}
              aria-invalid={Boolean(showError('confirmPassword'))}
            />
            {showError('confirmPassword') && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="auth-footer">
          Already registered? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
