import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import HealthRecords from './pages/HealthRecords';
import HealthTips from './pages/HealthTips';
import 'antd/dist/reset.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Login Page - Default Route */}
          <Route path="/" element={<Login />} />

          {/* Register Page */}
          <Route path="/register" element={<Register />} />

          {/* Dashboard - Main Page After Login */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Health Records Page */}
          <Route path="/records" element={<HealthRecords />} />

          {/* Health Tips Page */}
          <Route path="/health-tips" element={<HealthTips />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
