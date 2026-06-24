import React from 'react';
import { Link } from 'react-router-dom';
import { departmentColorVar, formatDate } from '../utils/constants';
import './EmployeeTable.css';

/**
 * @param {{
 *   employees: object[],
 *   sort: 'fullName'|'-fullName'|'',
 *   onSortChange: (sort: string) => void,
 *   onDeleteRequest: (employee: object) => void,
 * }} props
 */
const EmployeeTable = ({ employees, sort, onSortChange, onDeleteRequest }) => {
  const isSortedAsc = sort === 'fullName';
  const isSortedDesc = sort === '-fullName';

  const toggleSort = () => {
    if (isSortedAsc) {
      onSortChange('-fullName');
    } else {
      onSortChange('fullName');
    }
  };

  if (employees.length === 0) {
    return (
      <div className="employee-empty">
        <p className="employee-empty-title">No employees match these filters.</p>
        <p className="text-muted">Try a different name, clear the department filter, or add a new record.</p>
      </div>
    );
  }

  return (
    <div className="employee-table-wrap">
      <table className="employee-table">
        <thead>
          <tr>
            <th>
              <button type="button" className="sort-btn" onClick={toggleSort}>
                Full name
                <span className="sort-arrow" aria-hidden="true">
                  {isSortedAsc ? '↑' : isSortedDesc ? '↓' : '↕'}
                </span>
              </button>
            </th>
            <th>Department</th>
            <th>Designation</th>
            <th className="hide-sm">Contact</th>
            <th className="hide-sm">Joined</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td>
                <div className="employee-name-cell">
                  <span
                    className="row-tab"
                    style={{ background: `var(${departmentColorVar(employee.department)})` }}
                    aria-hidden="true"
                  />
                  <div>
                    <span className="employee-name">{employee.fullName}</span>
                    <span className="employee-email mono">{employee.email}</span>
                  </div>
                </div>
              </td>
              <td>
                <span className="dept-badge">
                  <span
                    className="swatch"
                    style={{ background: `var(${departmentColorVar(employee.department)})` }}
                  />
                  {employee.department}
                </span>
              </td>
              <td>{employee.designation}</td>
              <td className="hide-sm mono">{employee.mobileNumber}</td>
              <td className="hide-sm mono">{formatDate(employee.joiningDate)}</td>
              <td>
                <div className="row-actions">
                  <Link to={`/employees/${employee._id}/edit`} className="btn btn-secondary btn-sm">
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => onDeleteRequest(employee)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
