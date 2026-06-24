import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { EMAIL_REGEX } from '../utils/constants';
import './AuthLayout.css';

const Login = () => {
  const { login } = useAuth();
  const { showSuccess } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || '/dashboard';

  const validate = (vals) => {
    const next = {};
    if (!vals.email.trim()) next.email = 'Email is required.';
    else if (!EMAIL_REGEX.test(vals.email.trim())) next.email = 'Enter a valid email address.';
    if (!vals.password) next.password = 'Password is required.';
    return next;
  };

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
    setTouched({ email: true, password: true });
    setServerError('');

    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      await login(values);
      showSuccess('Welcome back — you are now signed in.');
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setServerError(error.message || 'Unable to sign in. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const showError = (field) => touched[field] && errors[field];

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-badge" aria-hidden="true">R</div>
        <span className="eyebrow">Roster · Sign in</span>
        <h1>Welcome back</h1>
        <span className="auth-subtitle">Sign in to manage your employee registry.</span>

        {serverError && (
          <div className="banner banner-error" role="alert">
            <span className="banner-icon" aria-hidden="true">⚠</span>
            <span>{serverError}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
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
              autoComplete="current-password"
              placeholder="••••••••"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={showError('password') ? 'has-error' : ''}
              aria-invalid={Boolean(showError('password'))}
            />
            {showError('password') && <span className="error-text">{errors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="auth-footer">
          New to Roster? <Link to="/register">Create an account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
