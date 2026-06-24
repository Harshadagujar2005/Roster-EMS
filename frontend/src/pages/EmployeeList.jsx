import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as employeeService from '../services/employeeService';
import { useToast } from '../context/ToastContext';
import { DEPARTMENTS } from '../utils/constants';
import EmployeeTable from '../components/EmployeeTable';
import Pagination from '../components/Pagination';
import ConfirmDialog from '../components/ConfirmDialog';
import Loader from '../components/Loader';
import './EmployeeList.css';

const LIMIT = 8;
const SEARCH_DEBOUNCE_MS = 400;

const EmployeeList = () => {
  const { showSuccess, showError } = useToast();

  const [employees, setEmployees] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [sort, setSort] = useState('fullName');
  const [page, setPage] = useState(1);

  const [meta, setMeta] = useState({ total: 0, totalPages: 1, limit: LIMIT });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Debounce free-text search input before it drives the API call.
  useEffect(() => {
    const handle = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [searchInput]);

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await employeeService.getEmployees({
        search,
        department,
        sort,
        page,
        limit: LIMIT,
      });
      setEmployees(data.data);
      setMeta({ total: data.total, totalPages: data.totalPages, limit: data.limit });
    } catch (error) {
      const message = error.message || 'Could not load employees.';
      setLoadError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, department, sort, page]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
    setPage(1);
  };

  const handleSortChange = (nextSort) => {
    setSort(nextSort);
    setPage(1);
  };

  const handleDeleteConfirmed = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await employeeService.deleteEmployee(pendingDelete._id);
      showSuccess(`${pendingDelete.fullName} was removed from the registry.`);
      setPendingDelete(null);

      // If we deleted the last row on a page beyond page 1, step back a page.
      if (employees.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        loadEmployees();
      }
    } catch (error) {
      showError(error.message || 'Could not delete this employee.');
    } finally {
      setDeleting(false);
    }
  };

  const hasActiveFilters = search || department || sort !== 'fullName';

  const clearFilters = () => {
    setSearchInput('');
    setSearch('');
    setDepartment('');
    setSort('fullName');
    setPage(1);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <span className="eyebrow">Registry</span>
          <h1>Employees</h1>
          <p className="lede">Search, filter and manage every employee on file.</p>
        </div>
        <Link to="/employees/new" className="btn btn-primary">+ Add employee</Link>
      </div>

      <div className="card card-pad employee-toolbar">
        <div className="field employee-search-field">
          <label htmlFor="search">Search by name</label>
          <input
            id="search"
            type="search"
            placeholder="Try “Priya” or “Anderson”…"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </div>

        <div className="field employee-dept-field">
          <label htmlFor="department-filter">Department</label>
          <select id="department-filter" value={department} onChange={handleDepartmentChange}>
            <option value="">All departments</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button type="button" className="btn btn-ghost employee-clear-btn" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <Loader fullPage label="Fetching employees…" />
      ) : loadError ? (
        <div className="banner banner-error" role="alert">
          <span className="banner-icon" aria-hidden="true">⚠</span>
          <span>{loadError}</span>
        </div>
      ) : (
        <>
          <EmployeeTable
            employees={employees}
            sort={sort}
            onSortChange={handleSortChange}
            onDeleteRequest={setPendingDelete}
          />
          <Pagination
            page={page}
            totalPages={meta.totalPages}
            total={meta.total}
            limit={meta.limit}
            onPageChange={setPage}
          />
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Remove this employee?"
        message={pendingDelete ? `This will permanently delete ${pendingDelete.fullName}'s record. This cannot be undone.` : ''}
        confirmLabel="Delete employee"
        tone="danger"
        busy={deleting}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};

export default EmployeeList;
