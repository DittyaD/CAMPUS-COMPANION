import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/theme.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import HealthRecords from './pages/HealthRecords';
import HealthTips from './pages/HealthTips';
import Appointments from './pages/Appointments';
import Medications from './pages/Medications';
import Patients from './pages/Patients';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/records" element={<HealthRecords />} />
        <Route path="/health-tips" element={<HealthTips />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/medications" element={<Medications />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/patients" element={<Patients />} />
      </Routes>
    </Router>
  );
}

export default App;
