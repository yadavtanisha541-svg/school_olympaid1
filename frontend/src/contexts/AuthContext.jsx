import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('olympiadhub_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = apiClient.getToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await apiClient.get('/auth/me');
        if (res.success && res.data) {
          setUser(res.data);
          sessionStorage.setItem('olympiadhub_user', JSON.stringify(res.data));
          localStorage.removeItem('olympiadhub_user'); // cleanup legacy
        }
      } catch (err) {
        apiClient.setToken(null);
        sessionStorage.removeItem('olympiadhub_user');
        localStorage.removeItem('olympiadhub_user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (loginId, password) => {
    const res = await apiClient.post('/auth/login', {
      login_id: loginId,
      password: password
    });

    if (res.success && res.data) {
      apiClient.setToken(res.data.token);
      setUser(res.data.user);
      sessionStorage.setItem('olympiadhub_user', JSON.stringify(res.data.user));
      localStorage.removeItem('olympiadhub_user'); // cleanup legacy
      return res.data.user;
    }
    throw new Error(res.message || 'Login failed');
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      apiClient.setToken(null);
      sessionStorage.removeItem('olympiadhub_user');
      sessionStorage.removeItem('olympiadhub_token');
      localStorage.removeItem('olympiadhub_user');
      localStorage.removeItem('olympiadhub_token');
      sessionStorage.clear();
      setUser(null);
    }
  };

  const hasPermission = (permCode) => {
    if (!user) return false;
    if (user.role === 'superadmin') return true;
    if (Array.isArray(user.permissions)) {
      return user.permissions.includes('all') || user.permissions.includes(permCode);
    }
    return false;
  };

  const isRole = (role) => {
    return user?.role === role;
  };

  const updateUser = (updater) => {
    setUser((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      if (next) {
        sessionStorage.setItem('olympiadhub_user', JSON.stringify(next));
      } else {
        sessionStorage.removeItem('olympiadhub_user');
      }
      localStorage.removeItem('olympiadhub_user');
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        hasPermission,
        isRole,
        setUser,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
