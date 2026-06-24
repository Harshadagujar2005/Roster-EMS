import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService';
import { TOKEN_STORAGE_KEY } from '../services/api';

const USER_STORAGE_KEY = 'ems_user';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  // "loading" covers the initial silent session check on app load
  const [loading, setLoading] = useState(true);

  const persistSession = useCallback((nextToken, nextUser) => {
    if (nextToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }

    if (nextUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }

    setToken(nextToken || null);
    setUser(nextUser || null);
  }, []);

  const logout = useCallback(() => {
    persistSession(null, null);
  }, [persistSession]);

  const login = useCallback(
    async ({ email, password }) => {
      const data = await authService.login({ email, password });
      persistSession(data.token, data.user);
      return data.user;
    },
    [persistSession]
  );

  const register = useCallback(
    async ({ name, email, password }) => {
      const data = await authService.register({ name, email, password });
      persistSession(data.token, data.user);
      return data.user;
    },
    [persistSession]
  );

  // On first load, if a token exists, quietly verify it's still valid and
  // refresh the cached user profile. If it's no longer valid, log out.
  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await authService.fetchCurrentUser();
        if (isMounted) {
          setUser(data.user);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
        }
      } catch {
        if (isMounted) {
          persistSession(null, null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    verifySession();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for global 401s raised by the axios interceptor and log out.
  useEffect(() => {
    const handleUnauthorized = () => {
      persistSession(null, null);
    };

    window.addEventListener('ems:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('ems:unauthorized', handleUnauthorized);
  }, [persistSession]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      loading,
      login,
      register,
      logout,
    }),
    [user, token, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
