import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // One-time cleanup: Clear any legacy auto-cached admin session across browsers
  try {
    if (typeof window !== 'undefined' && !localStorage.getItem('olympiadhub_auth_cleaned_v2')) {
      localStorage.removeItem('olympiadhub_user');
      localStorage.removeItem('olympiadhub_token');
      sessionStorage.removeItem('olympiadhub_user');
      sessionStorage.removeItem('olympiadhub_token');
      localStorage.removeItem('olympiadhub_route_state');
      localStorage.removeItem('olympiadhub_current_tab');
      localStorage.setItem('olympiadhub_auth_cleaned_v2', 'true');
    }
  } catch (e) {}

  const [user, setUser] = useState(() => {
    try {
      const token = apiClient.getToken();
      if (!token) return null;

      // Super Admin sessions MUST come strictly from sessionStorage (tab session)
      // When website or tab is closed, sessionStorage is destroyed automatically.
      const sessionStr = sessionStorage.getItem('olympiadhub_user');
      if (sessionStr) {
        return JSON.parse(sessionStr);
      }

      const localStr = localStorage.getItem('olympiadhub_user');
      if (localStr) {
        const u = JSON.parse(localStr);
        if (u?.role === 'superadmin') {
          // Superadmin must NEVER persist in localStorage!
          localStorage.removeItem('olympiadhub_user');
          localStorage.removeItem('olympiadhub_token');
          localStorage.removeItem('token');
          return null;
        }
        return u;
      }
      return null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // Automatically ensure admin is logged out as soon as the tab / window / website is closed
  useEffect(() => {
    const handleTabClose = () => {
      try {
        const sessionStr = sessionStorage.getItem('olympiadhub_user');
        const localStr = localStorage.getItem('olympiadhub_user');
        let role = '';
        if (sessionStr) role = JSON.parse(sessionStr)?.role;
        else if (localStr) role = JSON.parse(localStr)?.role;

        if (role === 'superadmin') {
          sessionStorage.removeItem('olympiadhub_user');
          sessionStorage.removeItem('olympiadhub_token');
          localStorage.removeItem('olympiadhub_user');
          localStorage.removeItem('olympiadhub_token');
          localStorage.removeItem('token');
          localStorage.removeItem('olympiadhub_route_state');
          localStorage.removeItem('olympiadhub_current_tab');
        }
      } catch (e) {}
    };

    window.addEventListener('beforeunload', handleTabClose);
    window.addEventListener('pagehide', handleTabClose);
    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
      window.removeEventListener('pagehide', handleTabClose);
    };
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const token = apiClient.getToken();
      const sessionUserStr = sessionStorage.getItem('olympiadhub_user');
      const localUserStr = localStorage.getItem('olympiadhub_user');
      let savedUser = null;
      try {
        if (sessionUserStr) {
          savedUser = JSON.parse(sessionUserStr);
        } else if (localUserStr) {
          const u = JSON.parse(localUserStr);
          if (u?.role === 'superadmin') {
            // Super Admin session expired when browser/tab was closed!
            localStorage.removeItem('olympiadhub_user');
            localStorage.removeItem('olympiadhub_token');
            localStorage.removeItem('token');
            setUser(null);
            setLoading(false);
            return;
          }
          savedUser = u;
        }
      } catch {}

      if (!token || !savedUser) {
        setUser(null);
        apiClient.setToken(null);
        sessionStorage.removeItem('olympiadhub_user');
        localStorage.removeItem('olympiadhub_user');
        setLoading(false);
        return;
      }

      try {
        const res = await apiClient.get('/auth/me');
        if (res.success && res.data) {
          const isSuperAdmin = res.data.role === 'superadmin';
          setUser(res.data);
          sessionStorage.setItem('olympiadhub_user', JSON.stringify(res.data));
          if (!isSuperAdmin) {
            localStorage.setItem('olympiadhub_user', JSON.stringify(res.data));
          } else {
            localStorage.removeItem('olympiadhub_user');
            localStorage.removeItem('olympiadhub_token');
            localStorage.removeItem('token');
          }
        } else {
          // If unauthenticated or token expired, clear session
          setUser(null);
          apiClient.setToken(null);
          sessionStorage.removeItem('olympiadhub_user');
          localStorage.removeItem('olympiadhub_user');
        }
      } catch (err) {
        // If error, force logout for security
        setUser(null);
        apiClient.setToken(null);
        sessionStorage.removeItem('olympiadhub_user');
        localStorage.removeItem('olympiadhub_user');
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
      const isSuperAdmin = res.data.user?.role === 'superadmin';
      // Super Admin is STRICTLY session-only!
      apiClient.setToken(res.data.token, isSuperAdmin);
      setUser(res.data.user);
      sessionStorage.setItem('olympiadhub_user', JSON.stringify(res.data.user));

      if (!isSuperAdmin) {
        localStorage.setItem('olympiadhub_user', JSON.stringify(res.data.user));
      } else {
        localStorage.removeItem('olympiadhub_user');
        localStorage.removeItem('olympiadhub_token');
        localStorage.removeItem('token');
        localStorage.removeItem('olympiadhub_route_state');
        localStorage.removeItem('olympiadhub_current_tab');
      }
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
      localStorage.removeItem('olympiadhub_route_state');
      localStorage.removeItem('olympiadhub_current_tab');
      sessionStorage.clear();
      setUser(null);
      if (typeof window !== 'undefined') {
        window.location.hash = '#/home';
      }
    }
  };

  const [permissionsTick, setPermissionsTick] = useState(0);

  useEffect(() => {
    const handlePermChange = () => {
      setPermissionsTick((t) => t + 1);
    };
    window.addEventListener('role-permissions-updated', handlePermChange);
    window.addEventListener('storage', handlePermChange);
    return () => {
      window.removeEventListener('role-permissions-updated', handlePermChange);
      window.removeEventListener('storage', handlePermChange);
    };
  }, []);

  const hasPermission = (permCode) => {
    if (!permCode) return true;
    const normalizedRole = (user?.role || '').toLowerCase().replace(/[\s_-]/g, '');
    const roleKey = (normalizedRole === 'superadmin' || normalizedRole === 'admin')
      ? 'superadmin'
      : (normalizedRole === 'teacher' ? 'teacher' : 'student');

    // 1. Super Admin always has full access to everything
    if (roleKey === 'superadmin') return true;

    // 2. Check if a customized role-permissions map exists in localStorage
    try {
      const savedMapStr = localStorage.getItem('olympiadhub_role_permissions_map_v2');
      if (savedMapStr) {
        const savedMap = JSON.parse(savedMapStr);
        if (savedMap && savedMap[roleKey] && savedMap[roleKey][permCode] !== undefined) {
          return Boolean(savedMap[roleKey][permCode]);
        }
      }
    } catch (e) {}

    // 3. Check explicit user permissions array if non-empty
    if (Array.isArray(user?.permissions) && user.permissions.length > 0) {
      if (user.permissions.includes('all') || user.permissions.includes(permCode)) {
        return true;
      }
    }

    // 4. Student role defaults: All student portal features must be accessible by default!
    if (roleKey === 'student') {
      // Disallow Super Admin and Teacher management tools by default
      if (
        (permCode.startsWith('manage_') && permCode !== 'manage_student_profile') ||
        permCode.startsWith('audit_') ||
        permCode.startsWith('publish_') ||
        permCode === 'access_superadmin_dashboard'
      ) {
        return false;
      }
      // Everything else (student dashboard, mock tests, generator, history, analytics, solutions, etc.) is allowed
      return true;
    }

    // 5. Teacher role defaults
    if (roleKey === 'teacher') {
      if (permCode.startsWith('manage_system_') || permCode.startsWith('manage_roles_') || permCode.startsWith('manage_payments_')) {
        return false;
      }
      return true;
    }

    return true;
  };

  const isRole = (role) => {
    return user?.role === role;
  };

  const updateUser = (updater) => {
    setUser((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      if (next) {
        sessionStorage.setItem('olympiadhub_user', JSON.stringify(next));
        localStorage.setItem('olympiadhub_user', JSON.stringify(next));
      } else {
        sessionStorage.removeItem('olympiadhub_user');
        localStorage.removeItem('olympiadhub_user');
      }
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
        updateUser,
        permissionsTick
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
