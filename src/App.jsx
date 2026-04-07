import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AdminDashboard from './pages/AdminDashboard';
import InteractiveMap from './components/InteractiveMap';
import DeviceTelemetry from './pages/DeviceTelemetry';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Provisioning from './pages/Provisioning';
import FleetExplorer from './pages/FleetExplorer';
import AlertRules from './pages/AlertRules';
import AuditLogs from './pages/AuditLogs';
import EnergyDashboard from './pages/EnergyDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// ProtectedRoute component to block unauthorized access and handle RBAC
function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // RBAC Check: If a specific role is required and user doesn't have it (and isn't admin)
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    console.warn(`[SECURITY] Unauthorized access attempt by ${user?.email} to ${window.location.hash}`);
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes Wrapper */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="map" element={<InteractiveMap />} />
            <Route path="telemetry" element={<FleetExplorer />} />
            <Route path="telemetry/:deviceId" element={<DeviceTelemetry />} />
            <Route path="energy" element={<EnergyDashboard />} />
            <Route path="settings" element={<ProtectedRoute requiredRole="admin"><Settings /></ProtectedRoute>} />
            <Route path="provisioning" element={<ProtectedRoute requiredRole="admin"><Provisioning /></ProtectedRoute>} />
            <Route path="rules" element={<ProtectedRoute requiredRole="admin"><AlertRules /></ProtectedRoute>} />
            <Route path="audit" element={<AuditLogs />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}

export default App;
