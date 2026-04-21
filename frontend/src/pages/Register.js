import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/theme.css';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const DEPARTMENTS = ['Computer Science', 'Biotechnology', 'Mechanical Engineering', 'Electronics', 'Civil Engineering', 'Electrical Engineering', 'Chemical Engineering', 'Information Technology'];

function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);
    const [form, setForm] = useState({
        firstName: '', lastName: '', email: '', contact: '', gender: '',
        dob: '', bloodGroup: '', department: '', yearOfStudy: '',
        address: '', emergencyName: '', emergencyContact: '',
        password: '', confirmPassword: '',
    });

    const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true); setMsg(null);
        if (!form.password || form.password.length < 6) {
            setMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
            setLoading(false); return;
        }
        if (form.password !== form.confirmPassword) {
            setMsg({ type: 'error', text: 'Passwords do not match.' });
            setLoading(false); return;
        }
        try {
            const payload = {
                first_name: form.firstName,
                last_name: form.lastName,
                date_of_birth: form.dob || '2000-01-01',
                gender: form.gender,
                blood_group: form.bloodGroup || null,
                contact_number: form.contact,
                email: form.email,
                address: form.address || null,
                emergency_contact_name: form.emergencyName || null,
                emergency_contact_number: form.emergencyContact || null,
                department: form.department || null,
                year_of_study: form.yearOfStudy ? parseInt(form.yearOfStudy) : null,
                registration_date: new Date().toISOString().split('T')[0],
                password: form.password,
            };
            const res = await api.addPatient(payload);
            if (res.success) {
                setMsg({ type: 'success', text: 'Registration successful! Please login.' });
                setTimeout(() => navigate('/'), 1500);
            } else {
                setMsg({ type: 'error', text: res.error || 'Registration failed.' });
            }
        } catch {
            setMsg({ type: 'error', text: 'Cannot reach backend. Is Flask running?' });
        } finally { setLoading(false); }
    };

    return (
        <div className="auth-page" style={{ alignItems: 'flex-start', padding: '40px 20px' }}>
            <div className="auth-box" style={{ maxWidth: 600, margin: '0 auto' }}>

                <div className="auth-logo">
                    <div className="auth-logo-icon">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                    </div>
                    <h1>Student Registration</h1>
                    <p>Campus Health &amp; Wellness Companion — VIT Chennai</p>
                </div>

                {msg && (
                    <div style={{
                        marginBottom: 16, padding: '10px 14px', borderRadius: 6, fontSize: 13,
                        background: msg.type === 'success' ? '#dcfce7' : '#fee2e2',
                        color: msg.type === 'success' ? '#15803d' : '#dc2626'
                    }}>
                        {msg.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">First Name <span className="req">*</span></label>
                            <input className="form-control" name="firstName" placeholder="Arjun" value={form.firstName} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Last Name <span className="req">*</span></label>
                            <input className="form-control" name="lastName" placeholder="Sharma" value={form.lastName} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address <span className="req">*</span></label>
                        <input className="form-control" type="email" name="email" placeholder="student@vit.ac.in" value={form.email} onChange={handleChange} required />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Contact Number <span className="req">*</span></label>
                            <input className="form-control" name="contact" placeholder="9876543210" value={form.contact} onChange={handleChange} required pattern="\d{10}" title="Phone number must be exactly 10 digits" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Gender <span className="req">*</span></label>
                            <select className="form-control" name="gender" value={form.gender} onChange={handleChange} required>
                                <option value="">Select gender…</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Date of Birth</label>
                            <input className="form-control" type="date" name="dob" value={form.dob} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Blood Group</label>
                            <select className="form-control" name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
                                <option value="">Select blood group…</option>
                                {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Department</label>
                            <select className="form-control" name="department" value={form.department} onChange={handleChange}>
                                <option value="">Select department…</option>
                                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Year of Study</label>
                            <select className="form-control" name="yearOfStudy" value={form.yearOfStudy} onChange={handleChange}>
                                <option value="">Select year…</option>
                                {[1, 2, 3, 4, 5].map(y => <option key={y} value={y}>Year {y}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Address</label>
                        <input className="form-control" name="address" placeholder="Full address" value={form.address} onChange={handleChange} />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Emergency Contact Name</label>
                            <input className="form-control" name="emergencyName" placeholder="Guardian name" value={form.emergencyName} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Emergency Contact Number</label>
                            <input className="form-control" name="emergencyContact" placeholder="Emergency phone" value={form.emergencyContact} onChange={handleChange} pattern="\d{10}" title="Phone number must be exactly 10 digits" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Password <span className="req">*</span></label>
                            <input className="form-control" type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm Password <span className="req">*</span></label>
                            <input className="form-control" type="password" name="confirmPassword" placeholder="Re-enter password" value={form.confirmPassword} onChange={handleChange} required />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 10, fontSize: 14 }} disabled={loading}>
                        {loading ? 'Registering...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-link-row">
                    Already have an account?{' '}
                    <button className="auth-link" onClick={() => navigate('/')}>Login here</button>
                </div>
            </div>
        </div>
    );
}

export default Register;
