import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Unconditionally purge any legacy or leaked superadmin from localStorage on every load
  try {
    if (typeof window !== 'undefined') {
      const localStr = localStorage.getItem('olympiadhub_user');
      if (localStr && JSON.parse(localStr)?.role === 'superadmin') {
        localStorage.removeItem('olympiadhub_user');
        localStorage.removeItem('olympiadhub_token');
        localStorage.removeItem('token');
        localStorage.removeItem('olympiadhub_route_state');
        localStorage.removeItem('olympiadhub_current_tab');
      }
    }
  } catch (e) {}

  const [user, setUser] = useState(() => {
    try {
      // 1. Check inactivity timeout for admin session
      const lastActiveStr = sessionStorage.getItem('olympiadhub_admin_last_active');
      if (lastActiveStr) {
        const elapsed = Date.now() - Number(lastActiveStr);
        const ADMIN_INACTIVITY_LIMIT_MS = 15 * 60 * 1000; // 15 minutes
        if (elapsed > ADMIN_INACTIVITY_LIMIT_MS) {
          sessionStorage.removeItem('olympiadhub_user');
          sessionStorage.removeItem('olympiadhub_token');
          sessionStorage.removeItem('olympiadhub_admin_last_active');
          return null;
        }
      }

      const token = apiClient.getToken();
      if (!token) return null;

      // Super Admin sessions MUST come strictly from active sessionStorage
      const sessionStr = sessionStorage.getItem('olympiadhub_user');
      if (sessionStr) {
        const u = JSON.parse(sessionStr);
        if (u?.role === 'superadmin') {
          sessionStorage.setItem('olympiadhub_admin_last_active', String(Date.now()));
          return u;
        }
        return u;
      }

      const localStr = localStorage.getItem('olympiadhub_user');
      if (localStr) {
        const u = JSON.parse(localStr);
        if (u?.role === 'superadmin') {
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

  // Inactivity / Idle Timeout for Super Admin (15 minutes of inactivity)
  // Auto-logs out if the admin leaves the panel unattended ("khula chod diya")
  // Or if the device/tab was left inactive and reopened after timeout
  useEffect(() => {
    if (!user || user.role !== 'superadmin') return;

    const ADMIN_INACTIVITY_LIMIT_MS = 15 * 60 * 1000; // 15 minutes

    const recordActivity = () => {
      try {
        sessionStorage.setItem('olympiadhub_admin_last_active', String(Date.now()));
      } catch (e) {}
    };

    if (!sessionStorage.getItem('olympiadhub_admin_last_active')) {
      recordActivity();
    }

    let lastThrottledTime = 0;
    const handleUserInteraction = () => {
      const now = Date.now();
      if (now - lastThrottledTime > 3000) {
        lastThrottledTime = now;
        recordActivity();
      }
    };

    const checkInactivity = () => {
      try {
        const lastActiveStr = sessionStorage.getItem('olympiadhub_admin_last_active');
        if (!lastActiveStr) return;
        const lastActive = Number(lastActiveStr);
        const elapsed = Date.now() - lastActive;

        if (elapsed > ADMIN_INACTIVITY_LIMIT_MS) {
          console.warn('Super Admin session timed out due to inactivity.');
          logout();
          if (typeof window !== 'undefined') {
            alert('Aapka Super Admin session inactivity (idle) ki wajah se logout ho gaya hai. Kripya punah login karein.');
          }
        }
      } catch (e) {}
    };

    // Check periodically every 15 seconds
    const intervalId = setInterval(checkInactivity, 15000);

    // Check when user switches back to tab or unlocks device
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkInactivity();
      }
    };

    const interactionEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    interactionEvents.forEach(evt => window.addEventListener(evt, handleUserInteraction, { passive: true }));
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      interactionEvents.forEach(evt => window.removeEventListener(evt, handleUserInteraction));
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  useEffect(() => {
    const checkAuth = async () => {
      // Check inactivity timeout first
      const lastActiveStr = sessionStorage.getItem('olympiadhub_admin_last_active');
      if (lastActiveStr) {
        const elapsed = Date.now() - Number(lastActiveStr);
        const ADMIN_INACTIVITY_LIMIT_MS = 15 * 60 * 1000; // 15 minutes
        if (elapsed > ADMIN_INACTIVITY_LIMIT_MS) {
          sessionStorage.removeItem('olympiadhub_user');
          sessionStorage.removeItem('olympiadhub_token');
          sessionStorage.removeItem('olympiadhub_admin_last_active');
          setUser(null);
          setLoading(false);
          return;
        }
      }

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
        sessionStorage.setItem('olympiadhub_admin_last_active', String(Date.now()));
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
      sessionStorage.removeItem('olympiadhub_admin_last_active');
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
        if (next.role !== 'superadmin') {
          localStorage.setItem('olympiadhub_user', JSON.stringify(next));
        } else {
          localStorage.removeItem('olympiadhub_user');
          localStorage.removeItem('olympiadhub_token');
          localStorage.removeItem('token');
        }
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
