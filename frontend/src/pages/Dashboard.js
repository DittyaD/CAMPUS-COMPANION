import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import api from '../services/api';

const MOODS = ['Happy', 'Calm', 'Neutral', 'Anxious', 'Sad', 'Stressed', 'Angry'];
const STRESS_LEVELS = ['Low', 'Medium', 'High', 'Very High'];

function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        mood: '', stress_level: 'Low', sleep_hours: '',
        water_intake_liters: '', physical_activity_minutes: '',
        steps_count: '', calories_intake: ''
    });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState(null);

    const patientId = parseInt(localStorage.getItem('patient_id') || '1');
    const name = localStorage.getItem('patient_name') || 'Student';
    const role = localStorage.getItem('role') || 'user';

    useEffect(() => { fetchStats(); }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await api.getStats();
            if (res.success) setStats(res.data);
        } catch { /* ignore */ } finally { setLoading(false); }
    };

    const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.mood || !form.sleep_hours) {
            setMsg({ type: 'error', text: 'Mood and sleep hours are required.' });
            return;
        }
        setSaving(true); setMsg(null);
        try {
            const payload = {
                patient_id: patientId,
                mood: form.mood,
                sleep_hours: parseFloat(form.sleep_hours),
                water_intake_liters: parseFloat(form.water_intake_liters) || 0,
                physical_activity_minutes: parseInt(form.physical_activity_minutes) || 0,
                stress_level: form.stress_level || 'Low',
                screen_time_hours: 0,
                steps_count: parseInt(form.steps_count) || 0,
                calories_intake: parseInt(form.calories_intake) || 0,
                meditation_minutes: 0,
            };
            const res = await api.addWellness(payload);
            if (res.success) {
                setMsg({ type: 'success', text: 'Health data saved successfully.' });
                setForm({ mood: '', stress_level: 'Low', sleep_hours: '', water_intake_liters: '', physical_activity_minutes: '', steps_count: '', calories_intake: '' });
                fetchStats();
            } else {
                setMsg({ type: 'error', text: res.error || 'Failed to save.' });
            }
        } catch {
            setMsg({ type: 'error', text: 'Cannot reach backend. Is Flask running on port 5000?' });
        } finally { setSaving(false); }
    };

    const STAT_CARDS = [
        { label: 'Total Patients', key: 'total_patients', color: 'blue' },
        { label: 'Scheduled Appointments', key: 'scheduled_appointments', color: 'green' },
        { label: 'Medications', key: 'total_medications', color: 'orange' },
        { label: 'Health Tips', key: 'total_tips', color: 'purple' },
    ];

    return (
        <AppLayout title="Dashboard">
            <div className="page-header">
                <h1>{role === 'admin' ? `Viewing Patient Insights: ${name}` : `Welcome back, ${name.split(' ')[0]}`}</h1>
                <p>{role === 'admin' ? 'Here is the health summary for this patient.' : 'Here is your health summary for today.'}</p>
            </div>

            <div className="stat-grid">
                {STAT_CARDS.map(s => (
                    <div className="stat-card" key={s.key}>
                        <div className={`stat-icon ${s.color}`}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: s.color === 'blue' ? '#1d4ed8' : s.color === 'green' ? '#15803d' : s.color === 'orange' ? '#c2410c' : '#7c3aed' }}>
                                {s.color === 'blue' && <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>}
                                {s.color === 'green' && <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>}
                                {s.color === 'orange' && <><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></>}
                                {s.color === 'purple' && <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>}
                            </svg>
                        </div>
                        <div>
                            <div className="stat-value">{loading ? '—' : (stats?.[s.key] ?? '—')}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {role !== 'admin' && (
                <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate('/appointments')}>Book Appointment</button>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate('/records')}>View Records</button>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate('/health-tips')}>Health Tips</button>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate('/medications')}>My Medications</button>
                </div>
            )}

            {role !== 'admin' && (
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Log Today&apos;s Health Data</h3>
                    </div>
                <div className="card-body">
                    {msg && (
                        <div style={{
                            marginBottom: 16, padding: '10px 14px', borderRadius: 6, fontSize: 13,
                            background: msg.type === 'success' ? '#f0fdf4' : '#fef2f2',
                            color: msg.type === 'success' ? '#15803d' : '#dc2626',
                            border: `1px solid ${msg.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                        }}>
                            {msg.text}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Mood <span className="req">*</span></label>
                                <select className="form-control" name="mood" value={form.mood} onChange={handleChange} required>
                                    <option value="">Select mood</option>
                                    {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Stress Level</label>
                                <select className="form-control" name="stress_level" value={form.stress_level} onChange={handleChange}>
                                    {STRESS_LEVELS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="form-row-3">
                            <div className="form-group">
                                <label className="form-label">Sleep Hours <span className="req">*</span></label>
                                <input className="form-control" type="number" name="sleep_hours" placeholder="e.g. 7.5" min="0" max="24" step="0.5" value={form.sleep_hours} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Water Intake (L)</label>
                                <input className="form-control" type="number" name="water_intake_liters" placeholder="e.g. 2.5" min="0" max="10" step="0.5" value={form.water_intake_liters} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Activity (minutes)</label>
                                <input className="form-control" type="number" name="physical_activity_minutes" placeholder="e.g. 30" min="0" value={form.physical_activity_minutes} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Steps Count</label>
                                <input className="form-control" type="number" name="steps_count" placeholder="e.g. 8000" min="0" value={form.steps_count} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Calories Intake</label>
                                <input className="form-control" type="number" name="calories_intake" placeholder="e.g. 2000" min="0" value={form.calories_intake} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                {saving ? 'Saving...' : 'Save to Database'}
                            </button>
                        </div>
                    </form>
                </div>
                </div>
            )}
        </AppLayout>
    );
}

export default Dashboard;
