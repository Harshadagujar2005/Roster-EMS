import React from 'react';
import './Loader.css';

/**
 * A small inline/blocking loading indicator.
 * @param {{label?: string, fullPage?: boolean, size?: 'sm'|'md'}} props
 */
const Loader = ({ label = 'Loading…', fullPage = false, size = 'md' }) => {
  const content = (
    <div className={`loader-inline loader-${size}`} role="status" aria-live="polite">
      <span className="loader-spinner" aria-hidden="true" />
      <span className="loader-label">{label}</span>
    </div>
  );

  if (fullPage) {
    return <div className="loader-fullpage">{content}</div>;
  }

  return content;
};

export default Loader;
