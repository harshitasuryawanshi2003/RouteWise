import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import AdminDashboard from './components/Admin/AdminDashboard';
import CollectorDashboard from './components/Collector/CollectorDashboard';
import CitizenDashboard from './components/Citizen/CitizenDashboard';

function App() {
  return (
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/collector" element={<CollectorDashboard/>}/>
          <Route path="/citizen" element={<CitizenDashboard/>}/>
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
  );
}

export default App;
