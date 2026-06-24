import api from './api';

/**
 * Fetches a page of employees.
 * @param {{search?: string, department?: string, sort?: string, page?: number, limit?: number}} params
 */
export const getEmployees = async (params = {}) => {
  // Strip empty/undefined values so we don't send noisy query params
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value !== undefined && value !== null)
  );

  const { data } = await api.get('/employees', { params: cleanParams });
  return data; // { success, count, total, page, totalPages, limit, data: [...] }
};

export const getEmployeeById = async (id) => {
  const { data } = await api.get(`/employees/${id}`);
  return data; // { success, data }
};

export const createEmployee = async (payload) => {
  const { data } = await api.post('/employees', payload);
  return data;
};

export const updateEmployee = async (id, payload) => {
  const { data } = await api.put(`/employees/${id}`, payload);
  return data;
};

export const deleteEmployee = async (id) => {
  const { data } = await api.delete(`/employees/${id}`);
  return data;
};

export default { getEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee };
