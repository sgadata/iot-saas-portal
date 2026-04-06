import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AdminDashboard from './pages/AdminDashboard';
import InteractiveMap from './components/InteractiveMap';
import DeviceTelemetry from './pages/DeviceTelemetry';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Provisioning from './pages/Provisioning';
import FleetExplorer from './pages/FleetExplorer';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// ProtectedRoute component to block unauthorized access
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
            <Route path="settings" element={<Settings />} />
            <Route path="provisioning" element={<Provisioning />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
