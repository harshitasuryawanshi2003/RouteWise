import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import AdminDashboard from './components/Admin/AdminDashboard';
import CollectorDashboard from './components/Collector/CollectorDashboard';
import CitizenDashboard from './components/Citizen/CitizenDashboard';
import ProtectedRoute from './components/Common/ProtectedRoute';

function App() {
  return (
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/admin"  element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/collector"   element={
            <ProtectedRoute allowedRoles={["Collector"]}>
              <CollectorDashboard />
            </ProtectedRoute>
          }/>
          <Route path="/citizen"   element={
            <ProtectedRoute allowedRoles={["Citizen"]}>
              <CitizenDashboard />
            </ProtectedRoute>
          }/>
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
  );
}

export default App;
