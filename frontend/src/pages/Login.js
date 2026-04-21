import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/theme.css';

function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // Forgot password flow
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState(1); // 1=enter email, 2=enter new password
  const [forgotPatientId, setForgotPatientId] = useState(null);
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [forgotMsg, setForgotMsg] = useState(null);
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.login(email.trim(), password);

      if (!res.success) {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
        return;
      }

      const { patient_id, name, role } = res.data;

      // Tab mismatch checks
      if (tab === 'admin' && role !== 'admin') {
        setError('This account does not have administrator privileges.');
        setLoading(false);
        return;
      }
      if (tab === 'user' && role === 'admin') {
        setError('Please use the Administrator Login tab for this account.');
        setLoading(false);
        return;
      }

      // Save to localStorage and go
      localStorage.setItem('patient_id', String(patient_id));
      localStorage.setItem('patient_name', name);
      localStorage.setItem('auth_name', name);
      localStorage.setItem('role', role);
      navigate(role === 'admin' ? '/admin' : '/dashboard');

    } catch {
      setError('Cannot reach backend. Make sure Flask is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotEmailSubmit = async (e) => {
    e.preventDefault(); setForgotLoading(true); setForgotMsg(null);
    try {
      const res = await api.forgotPassword(forgotEmail);
      if (res.success) { setForgotPatientId(res.patient_id); setForgotStep(2); }
      else { setForgotMsg({ type: 'error', text: res.error }); }
    } catch { setForgotMsg({ type: 'error', text: 'Cannot reach backend.' }); }
    finally { setForgotLoading(false); }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault(); setForgotLoading(true); setForgotMsg(null);
    if (newPass.length < 6) { setForgotMsg({ type: 'error', text: 'Password must be at least 6 characters.' }); setForgotLoading(false); return; }
    if (newPass !== confirmNewPass) { setForgotMsg({ type: 'error', text: 'Passwords do not match.' }); setForgotLoading(false); return; }
    try {
      const res = await api.resetPassword(forgotPatientId, newPass);
      if (res.success) {
        setForgotMsg({ type: 'success', text: 'Password updated. Please log in.' });
        setTimeout(() => { setForgotMode(false); setForgotStep(1); setForgotEmail(''); setNewPass(''); setConfirmNewPass(''); }, 1800);
      } else { setForgotMsg({ type: 'error', text: res.error }); }
    } catch { setForgotMsg({ type: 'error', text: 'Cannot reach backend.' }); }
    finally { setForgotLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">

        <div className="auth-logo">
          <div className="auth-logo-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <h1>Campus Health &amp; Wellness</h1>
          <p>VIT Chennai &mdash; Health Management System</p>
        </div>

        {forgotMode ? (
          <>
            <div style={{ marginBottom: 16 }}>
              <button className="auth-link" onClick={() => { setForgotMode(false); setForgotStep(1); setForgotMsg(null); }} style={{ fontSize: 13 }}>
                &larr; Back to Login
              </button>
            </div>
            <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
              {forgotStep === 1 ? 'Reset Password' : 'Set New Password'}
            </h3>
            {forgotMsg && (
              <div style={{ marginBottom: 12, padding: '8px 12px', borderRadius: 6, fontSize: 13,
                background: forgotMsg.type === 'success' ? '#dcfce7' : '#fee2e2',
                color: forgotMsg.type === 'success' ? '#15803d' : '#dc2626' }}>
                {forgotMsg.text}
              </div>
            )}
            {forgotStep === 1 ? (
              <form onSubmit={handleForgotEmailSubmit}>
                <div className="form-group">
                  <label className="form-label">Registered Email Address</label>
                  <input className="form-control" type="email" placeholder="student@vit.ac.in" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px 0' }} disabled={forgotLoading}>
                  {forgotLoading ? 'Verifying...' : 'Verify Email'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit}>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input className="form-control" type="password" placeholder="Min. 6 characters" value={newPass} onChange={e => setNewPass(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input className="form-control" type="password" placeholder="Re-enter new password" value={confirmNewPass} onChange={e => setConfirmNewPass(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px 0' }} disabled={forgotLoading}>
                  {forgotLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            )}
          </>
        ) : (
          <>
        <div className="auth-tab-row">
          <button
            className={`auth-tab${tab === 'user' ? ' active' : ''}`}
            onClick={() => { setTab('user'); setError(''); }}
          >
            Student Login
          </button>
          <button
            className={`auth-tab${tab === 'admin' ? ' active' : ''}`}
            onClick={() => { setTab('admin'); setError(''); }}
          >
            Administrator Login
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-control"
              type="text"
              placeholder={tab === 'admin' ? 'admin@vit.ac.in' : 'student@vit.ac.in'}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPass(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{
              color: '#dc2626', fontSize: 13, marginBottom: 12,
              background: '#fef2f2', padding: '8px 12px', borderRadius: 6,
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '10px 0', fontSize: 14 }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

          {tab === 'user' && (
            <div className="auth-link-row" style={{ marginTop: 18 }}>
              Don&apos;t have an account?{' '}
              <button className="auth-link" onClick={() => navigate('/register')}>
                Register here
              </button>
            </div>
          )}

          {tab === 'user' && (
            <div className="auth-link-row" style={{ marginTop: 8 }}>
              <button className="auth-link" onClick={() => { setForgotMode(true); setError(''); }}>
                Forgot Password?
              </button>
            </div>
          )}
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
