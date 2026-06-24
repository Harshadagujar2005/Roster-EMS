import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './NotFound.css';

const NotFound = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="not-found-screen">
      <div className="not-found-card">
        <span className="not-found-tag mono">FILE NOT FOUND</span>
        <h1>404</h1>
        <p>This record doesn't exist in the registry — it may have been moved, renamed, or never filed.</p>
        <Link to={isAuthenticated ? '/dashboard' : '/login'} className="btn btn-primary">
          {isAuthenticated ? 'Back to dashboard' : 'Back to sign in'}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
