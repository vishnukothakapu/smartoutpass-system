import React, { createContext, useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { LoginScreen } from './screens/LoginScreen';
import { StudentDashboard } from './screens/student/StudentDashboard';
import { ApplyOutpass } from './screens/student/ApplyOutpass';
import { OutpassStatus } from './screens/student/OutpassStatus';
import { WardenDashboard } from './screens/warden/WardenDashboard';
import { WardenApproval } from './screens/warden/WardenApproval';
import { SecurityScanner } from './screens/security/SecurityScanner';
import { SecurityLog } from './screens/security/SecurityLog';
import { mockUsers, initialOutpasses, mockLogs } from './data/mockData';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Set to null default
  const [outpasses, setOutpasses] = useState(initialOutpasses);
  const [logs, setLogs] = useState(mockLogs);

  const login = (role, email) => {
    const baseUser = { ...mockUsers[role] };
    
    if (role === 'student' && email) {
      // Parse email e.g., "bcs_2023028@iiitm.ac.in"
      const prefix = email.split('@')[0]; // "bcs_2023028"
      const parts = prefix.split('_'); // ["bcs", "2023028"]
      
      if (parts.length >= 2) {
        baseUser.program = parts[0].toUpperCase();
        baseUser.batch = parts[1].substring(0, 4); // Extract "2023" from "2023028"
      }
    }
    
    setUser(baseUser);
  };

  const logout = () => setUser(null);

  const addOutpass = (data) => {
    const newOutpass = {
      ...data,
      id: `OUT-${Math.floor(Math.random() * 10000)}`,
      studentId: user.id,
      studentName: user.name,
      studentProgram: user.program,
      studentBatch: user.batch,
      status: 'pending',
      appliedAt: new Date().toISOString()
    };
    setOutpasses([newOutpass, ...outpasses]);
    return newOutpass.id;
  };

  const updateOutpassStatus = (id, status) => {
    setOutpasses(prev => prev.map(o => {
      if(o.id === id) {
        return { 
          ...o, 
          status, 
          qrData: status === 'approved' ? btoa(JSON.stringify({id: o.id})) : null 
        };
      }
      return o;
    }));
  };

  const addLog = (outpass, type) => {
    setLogs([{ id: Date.now(), outpassId: outpass.id, type, timestamp: new Date().toISOString(), studentName: outpass.studentName }, ...logs]);
  };

  return (
    <AppContext.Provider value={{ user, login, logout, outpasses, addOutpass, updateOutpassStatus, logs, addLog }}>
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
      <div className="app-layout">
        <Header user={user} onLogout={logout} />
        <main className="container screen-enter">
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
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
