import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import * as employeeService from '../services/employeeService';
import { DEPARTMENTS, departmentColorVar, formatDate } from '../utils/constants';
import Loader from '../components/Loader';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { showError } = useToast();

  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [deptCounts, setDeptCounts] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      setLoadError('');
      try {
        const [overview, ...deptResults] = await Promise.all([
          employeeService.getEmployees({ page: 1, limit: 5 }),
          ...DEPARTMENTS.map((dept) => employeeService.getEmployees({ department: dept, limit: 1 })),
        ]);

        if (!isMounted) return;

        setTotal(overview.total);
        setRecent(overview.data);
        setDeptCounts(
          DEPARTMENTS.map((dept, index) => ({ department: dept, count: deptResults[index].total }))
            .filter((row) => row.count > 0)
            .sort((a, b) => b.count - a.count)
        );
      } catch (error) {
        if (isMounted) {
          const message = error.message || 'Could not load dashboard data.';
          setLoadError(message);
          showError(message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboard();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const maxDeptCount = deptCounts.length ? deptCounts[0].count : 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1>Good to see you, {user?.name?.split(' ')[0] || 'there'}.</h1>
          <p className="lede">Here's the current state of the registry.</p>
        </div>
        <Link to="/employees/new" className="btn btn-primary">+ Add employee</Link>
      </div>

      {loading ? (
        <Loader fullPage label="Pulling the latest figures…" />
      ) : loadError ? (
        <div className="banner banner-error" role="alert">
          <span className="banner-icon" aria-hidden="true">⚠</span>
          <span>{loadError}</span>
        </div>
      ) : (
        <>
          <div className="dash-stats">
            <div className="card card-pad dash-stat-card dash-stat-primary">
              <span className="dash-stat-label">Total employees</span>
              <span className="dash-stat-value">{total}</span>
              <span className="text-faint">Across {deptCounts.length} department{deptCounts.length === 1 ? '' : 's'}</span>
            </div>

            <div className="card card-pad dash-stat-card">
              <span className="dash-stat-label">Most recent hire</span>
              {recent[0] ? (
                <>
                  <span className="dash-stat-value dash-stat-value-sm">{recent[0].fullName}</span>
                  <span className="text-faint">Joined {formatDate(recent[0].joiningDate)}</span>
                </>
              ) : (
                <span className="text-faint">No employees yet</span>
              )}
            </div>

            <div className="card card-pad dash-stat-card">
              <span className="dash-stat-label">Largest department</span>
              {deptCounts[0] ? (
                <>
                  <span className="dash-stat-value dash-stat-value-sm">{deptCounts[0].department}</span>
                  <span className="text-faint">{deptCounts[0].count} employee{deptCounts[0].count === 1 ? '' : 's'}</span>
                </>
              ) : (
                <span className="text-faint">No data yet</span>
              )}
            </div>
          </div>

          <div className="dash-grid">
            <div className="card card-pad">
              <div className="row space-between" style={{ marginBottom: 16 }}>
                <h2>Department breakdown</h2>
              </div>
              {deptCounts.length === 0 ? (
                <p className="text-muted">No employees recorded yet. Add your first employee to see a breakdown by department.</p>
              ) : (
                <div className="dept-bars">
                  {deptCounts.map((row) => (
                    <div className="dept-bar-row" key={row.department}>
                      <span className="dept-bar-label">{row.department}</span>
                      <div className="dept-bar-track">
                        <div
                          className="dept-bar-fill"
                          style={{
                            width: `${Math.max(6, (row.count / maxDeptCount) * 100)}%`,
                            background: `var(${departmentColorVar(row.department)})`,
                          }}
                        />
                      </div>
                      <span className="dept-bar-count mono">{row.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card card-pad">
              <div className="row space-between" style={{ marginBottom: 16 }}>
                <h2>Recently added</h2>
                <Link to="/employees" className="text-muted">View all →</Link>
              </div>
              {recent.length === 0 ? (
                <p className="text-muted">Nothing here yet.</p>
              ) : (
                <ul className="recent-list">
                  {recent.map((employee) => (
                    <li key={employee._id} className="recent-item">
                      <span
                        className="row-tab"
                        style={{ background: `var(${departmentColorVar(employee.department)})` }}
                        aria-hidden="true"
                      />
                      <div className="recent-item-meta">
                        <span className="recent-item-name">{employee.fullName}</span>
                        <span className="text-faint">{employee.designation} · {employee.department}</span>
                      </div>
                      <span className="text-faint mono">{formatDate(employee.joiningDate)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
