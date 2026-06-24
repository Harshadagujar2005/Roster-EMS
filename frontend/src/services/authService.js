import api from './api';

/**
 * Registers a new user.
 * @param {{name: string, email: string, password: string}} payload
 * @returns {Promise<{token: string, user: object}>}
 */
export const register = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  return data;
};

/**
 * Logs a user in.
 * @param {{email: string, password: string}} payload
 * @returns {Promise<{token: string, user: object}>}
 */
export const login = async (payload) => {
  const { data } = await api.post('/auth/login', payload);
  return data;
};

/**
 * Fetches the currently authenticated user's profile.
 * @returns {Promise<{user: object}>}
 */
export const fetchCurrentUser = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

export default { register, login, fetchCurrentUser };
