import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeForm from '../components/EmployeeForm';
import * as employeeService from '../services/employeeService';
import { useToast } from '../context/ToastContext';
import './EmployeeFormPage.css';

const AddEmployee = () => {
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (values) => {
    setBusy(true);
    setServerError('');
    try {
      await employeeService.createEmployee(values);
      showSuccess(`${values.fullName} was added to the registry.`);
      navigate('/employees');
    } catch (error) {
      setServerError(error.message || 'Could not create this employee. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <span className="eyebrow">Registry · New entry</span>
          <h1>Add employee</h1>
          <p className="lede">Create a new personnel record. Fields marked are required.</p>
        </div>
      </div>

      <div className="card card-pad employee-form-card">
        <EmployeeForm
          submitLabel="Add employee"
          busy={busy}
          serverError={serverError}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/employees')}
        />
      </div>
    </div>
  );
};

export default AddEmployee;
