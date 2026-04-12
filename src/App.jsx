import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Header } from './components/layout/Header';
import { LoginScreen } from './screens/LoginScreen';
import { StudentDashboard } from './screens/student/StudentDashboard';
import { ApplyOutpass } from './screens/student/ApplyOutpass';
import { OutpassStatus } from './screens/student/OutpassStatus';
import { WardenDashboard } from './screens/warden/WardenDashboard';
import { WardenApproval } from './screens/warden/WardenApproval';
import { SecurityScanner } from './screens/security/SecurityScanner';
import { SecurityLog } from './screens/security/SecurityLog';
import { loginApi, googleLoginApi } from './api/auth';
import { updateProfile as updateProfileApi } from './api/profile';
import {
  getOutpasses,
  createOutpass as createOutpassApi,
  updateOutpassStatus as updateOutpassStatusApi,
} from './api/outpasses';
import { getLogs, addLog as addLogApi } from './api/logs';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // ─── Auth State ────────────────────────────────────────────────────────────
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // ─── Data State ────────────────────────────────────────────────────────────
  const [outpasses, setOutpasses] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loadingOutpasses, setLoadingOutpasses] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // ─── Fetch outpasses when user logs in ────────────────────────────────────
  const fetchOutpasses = useCallback(async (silent = false) => {
    if (!user) return;
    if (!silent) setLoadingOutpasses(true);
    try {
      const data = await getOutpasses();
      setOutpasses(data);
    } catch (err) {
      console.error('Failed to fetch outpasses:', err);
    } finally {
      if (!silent) setLoadingOutpasses(false);
    }
  }, [user]);

  // ─── Fetch logs (security/warden only) ────────────────────────────────────
  const fetchLogs = useCallback(async (silent = false) => {
    if (!user || user.role === 'student') return;
    if (!silent) setLoadingLogs(true);
    try {
      const data = await getLogs();
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      if (!silent) setLoadingLogs(false);
    }
  }, [user]);

  useEffect(() => {
    // Initial fetch on mount
    fetchOutpasses();
    fetchLogs();

    // Auto-refresh data silently every 10 seconds
    const interval = setInterval(() => {
      fetchOutpasses(true);
      fetchLogs(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchOutpasses, fetchLogs]);

  // ─── Auth Actions ─────────────────────────────────────────────────────────
  const login = async (role, email, password) => {
    const { token, user: userData } = await loginApi(role, email, password);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const googleLogin = async (credential) => {
    const { token, user: userData } = await googleLoginApi(credential);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setOutpasses([]);
    setLogs([]);
  };

  // ─── Profile Update ─────────────────────────────────────────────────────
  const updateProfile = (updatedUser) => {
    const merged = { ...user, ...updatedUser };
    localStorage.setItem('user', JSON.stringify(merged));
    setUser(merged);
  };

  // ─── Outpass Actions ──────────────────────────────────────────────────────
  const addOutpass = async (payload) => {
    const newOutpass = await createOutpassApi(payload);
    setOutpasses((prev) => [newOutpass, ...prev]);
    return newOutpass._id;
  };

  const updateOutpassStatus = async (id, status) => {
    const updated = await updateOutpassStatusApi(id, status);
    setOutpasses((prev) => prev.map((o) => (o._id === id ? updated : o)));
    return updated;
  };

  // ─── Log Actions ──────────────────────────────────────────────────────────
  const addLog = async (outpass, type) => {
    const log = await addLogApi(
      outpass._id,
      outpass.studentName,
      outpass.studentId,
      type
    );
    setLogs((prev) => [log, ...prev]);
    return log;
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        googleLogin,
        logout,
        updateProfile,
        outpasses,
        addOutpass,
        updateOutpassStatus,
        logs,
        addLog,
        fetchOutpasses,
        fetchLogs,
        loadingOutpasses,
        loadingLogs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useApp();
  if (!user) return <Navigate to="/" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to={`/${user.role}`} />;
  return children;
};

function AppRoutes() {
  const { user, logout } = useApp();

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
        <Header user={user} onLogout={logout} />
        <main className="flex-1">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
          <Routes>
            <Route path="/" element={!user ? <LoginScreen /> : <Navigate to={`/${user.role}`} />} />

            {/* Student Routes */}
            <Route path="/student" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/apply" element={<ProtectedRoute allowedRole="student"><ApplyOutpass /></ProtectedRoute>} />
            <Route path="/student/status/:id" element={<ProtectedRoute allowedRole="student"><OutpassStatus /></ProtectedRoute>} />

            {/* Warden Routes */}
            <Route path="/warden" element={<ProtectedRoute allowedRole="warden"><WardenDashboard /></ProtectedRoute>} />
            <Route path="/warden/request/:id" element={<ProtectedRoute allowedRole="warden"><WardenApproval /></ProtectedRoute>} />

            {/* Security Routes */}
            <Route path="/security" element={<ProtectedRoute allowedRole="security"><SecurityScanner /></ProtectedRoute>} />
            <Route path="/security/logs" element={<ProtectedRoute allowedRole="security"><SecurityLog /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
