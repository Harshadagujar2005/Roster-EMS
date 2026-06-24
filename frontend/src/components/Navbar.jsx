import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: '◧' },
  { to: '/employees', label: 'Employees', icon: '☰' },
  { to: '/employees/new', label: 'Add employee', icon: '✚' },
];

const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <button
        type="button"
        className="navbar-mobile-toggle"
        onClick={() => setMobileOpen((open) => !open)}
        aria-expanded={mobileOpen}
        aria-label="Toggle navigation menu"
      >
        <span className="navbar-mobile-toggle-bar" />
        <span className="navbar-mobile-toggle-bar" />
        <span className="navbar-mobile-toggle-bar" />
      </button>

      <aside className={`navbar ${mobileOpen ? 'navbar-open' : ''}`}>
        <div className="navbar-brand">
          <span className="navbar-mark" aria-hidden="true">R</span>
          <div>
            <strong className="navbar-title">Roster</strong>
            <span className="navbar-subtitle">Employee Registry</span>
          </div>
        </div>

        <nav className="navbar-links" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) => `navbar-link ${isActive ? 'navbar-link-active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="navbar-link-icon" aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-footer">
          <div className="navbar-user">
            <span className="navbar-avatar" aria-hidden="true">{initials(user?.name)}</span>
            <div className="navbar-user-meta">
              <span className="navbar-user-name">{user?.name || 'Account'}</span>
              <span className="navbar-user-email">{user?.email || ''}</span>
            </div>
          </div>
          <button type="button" className="btn btn-secondary btn-sm btn-block" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          className="navbar-scrim"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
