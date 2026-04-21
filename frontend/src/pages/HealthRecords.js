import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import api from '../services/api';

const MOOD_BADGE = { Happy: 'badge-green', Calm: 'badge-cyan', Neutral: 'badge-blue', Anxious: 'badge-orange', Sad: 'badge-orange', Stressed: 'badge-red', Angry: 'badge-red' };
const STRESS_BADGE = { Low: 'badge-green', Medium: 'badge-yellow', High: 'badge-orange', 'Very High': 'badge-red' };

function HealthRecords() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const patientId = parseInt(localStorage.getItem('patient_id') || '1');

    const role = localStorage.getItem('role') || 'user';

    useEffect(() => { fetchRecords(); }, []); // eslint-disable-line

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const res = await api.getWellness(patientId);
            if (res.success) setRecords(res.data);
        } catch { /* ignore */ } finally { setLoading(false); }
    };

    const avgSleep = records.length
        ? (records.reduce((s, r) => s + (r.sleep_hours || 0), 0) / records.length).toFixed(1)
        : '—';
    const avgSteps = records.length
        ? Math.round(records.reduce((s, r) => s + (r.steps_count || 0), 0) / records.length)
        : '—';

    return (
        <AppLayout title={role === 'admin' ? "Patient Health Records" : "My Health Records"}>
            <div className="page-header">
                <h1>Wellness Records &mdash; Patient #{patientId}</h1>
                <p>Daily health tracking history.</p>
            </div>

            <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
                <div className="stat-card"><div className="stat-icon blue" /><div><div className="stat-value">{records.length}</div><div className="stat-label">Total Entries</div></div></div>
                <div className="stat-card"><div className="stat-icon purple" /><div><div className="stat-value">{avgSleep}</div><div className="stat-label">Avg. Sleep (hrs)</div></div></div>
                <div className="stat-card"><div className="stat-icon green" /><div><div className="stat-value">{typeof avgSteps === 'number' ? avgSteps.toLocaleString() : '—'}</div><div className="stat-label">Avg. Steps</div></div></div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Wellness Log</h3>
                    <button className="btn btn-ghost btn-sm" onClick={fetchRecords}>Refresh</button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    {loading ? (
                        <div className="empty-state"><p>Loading records...</p></div>
                    ) : records.length === 0 ? (
                        <div className="empty-state">
                            <h3>No Records Yet</h3>
                            <p>Start logging health data from the Dashboard.</p>
                        </div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th><th>Mood</th><th>Stress</th><th>Sleep (hrs)</th>
                                    <th>Water (L)</th><th>Activity (min)</th><th>Steps</th><th>Calories</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((r, i) => (
                                    <tr key={i}>
                                        <td>{r.tracker_date || '—'}</td>
                                        <td><span className={`badge ${MOOD_BADGE[r.mood] || 'badge-gray'}`}>{r.mood || '—'}</span></td>
                                        <td><span className={`badge ${STRESS_BADGE[r.stress_level] || 'badge-gray'}`}>{r.stress_level || '—'}</span></td>
                                        <td>{r.sleep_hours != null ? `${r.sleep_hours} hrs` : '—'}</td>
                                        <td>{r.water_intake_liters != null ? `${r.water_intake_liters} L` : '—'}</td>
                                        <td>{r.physical_activity_minutes != null ? `${r.physical_activity_minutes} min` : '—'}</td>
                                        <td>{r.steps_count != null ? r.steps_count.toLocaleString() : '—'}</td>
                                        <td>{r.calories_intake != null ? r.calories_intake.toLocaleString() : '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

export default HealthRecords;
