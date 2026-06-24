import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import EmployeeForm from '../components/EmployeeForm';
import Loader from '../components/Loader';
import * as employeeService from '../services/employeeService';
import { useToast } from '../context/ToastContext';
import { toDateInputValue } from '../utils/constants';
import './EmployeeFormPage.css';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadEmployee = async () => {
      setLoading(true);
      setLoadError('');
      try {
        const { data } = await employeeService.getEmployeeById(id);
        if (isMounted) {
          setInitialValues({
            fullName: data.fullName,
            email: data.email,
            mobileNumber: data.mobileNumber,
            department: data.department,
            designation: data.designation,
            joiningDate: toDateInputValue(data.joiningDate),
          });
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(error.message || 'Could not load this employee record.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadEmployee();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmit = async (values) => {
    setBusy(true);
    setServerError('');
    try {
      await employeeService.updateEmployee(id, values);
      showSuccess(`${values.fullName}'s record was updated.`);
      navigate('/employees');
    } catch (error) {
      setServerError(error.message || 'Could not update this employee. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <span className="eyebrow">Registry · Edit entry</span>
          <h1>Edit employee</h1>
          <p className="lede">Update this employee's details below.</p>
        </div>
      </div>

      <div className="card card-pad employee-form-card">
        {loading ? (
          <Loader label="Loading employee record…" />
        ) : loadError ? (
          <div className="banner banner-error" role="alert">
            <span className="banner-icon" aria-hidden="true">⚠</span>
            <span>
              {loadError} <Link to="/employees">Back to employees</Link>
            </span>
          </div>
        ) : (
          <EmployeeForm
            initialValues={initialValues}
            submitLabel="Save changes"
            busy={busy}
            serverError={serverError}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/employees')}
          />
        )}
      </div>
    </div>
  );
};

export default EditEmployee;
