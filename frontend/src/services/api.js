import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const TOKEN_STORAGE_KEY = 'ems_token';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the JWT (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error messages and broadcast a global "unauthorized" event on
// 401 responses so AuthContext can log the user out, without creating a
// circular import between the api client and the auth context.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';

    if (status === 401) {
      window.dispatchEvent(new CustomEvent('ems:unauthorized'));
    }

    return Promise.reject({ status, message, original: error });
  }
);

export default api;
