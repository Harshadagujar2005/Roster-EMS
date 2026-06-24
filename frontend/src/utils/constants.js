// Shared constants and small pure helpers used across pages/components.

export const DEPARTMENTS = [
  'Engineering',
  'Sales',
  'Marketing',
  'Human Resources',
  'Finance',
  'Operations',
  'Customer Support',
  'Design',
  'Legal',
  'IT',
];

const TAB_COLOR_VARS = [
  '--tab-0',
  '--tab-1',
  '--tab-2',
  '--tab-3',
  '--tab-4',
  '--tab-5',
  '--tab-6',
  '--tab-7',
];

/**
 * Deterministically maps a department name to one of the CSS tab colour
 * variables, so the same department always gets the same colour without
 * needing a stored mapping.
 */
export const departmentColorVar = (department = '') => {
  let hash = 0;
  for (let i = 0; i < department.length; i += 1) {
    hash = (hash * 31 + department.charCodeAt(i)) >>> 0;
  }
  return TAB_COLOR_VARS[hash % TAB_COLOR_VARS.length];
};

export const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Converts a date (or ISO string) into the yyyy-MM-dd format expected by
 * <input type="date" />.
 */
export const toDateInputValue = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MOBILE_REGEX = /^[0-9+\-\s()]{7,20}$/;
