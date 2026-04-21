import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import api from '../services/api';

const IMPORTANCE_BADGE = { Critical: 'badge-red', High: 'badge-orange', Medium: 'badge-blue', Low: 'badge-green' };
const CATEGORIES = ['All', 'Hydration', 'Sleep Health', 'Nutrition', 'Mental Health', 'Physical Activity', 'Eye Care', 'Hygiene'];

function HealthTips() {
    const [tips, setTips] = useState([]);
    const [latestDoctorAdvice, setLatestDoctorAdvice] = useState(null);
    const [wellnessAdvice, setWellnessAdvice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [category, setCat] = useState('All');
    const patientId = parseInt(localStorage.getItem('patient_id') || '1');
    const role = localStorage.getItem('role') || 'user';

    useEffect(() => { fetchTips(category); fetchAdvice(); fetchWellnessInsights(); }, [category]); // eslint-disable-line

    const fetchTips = async (cat) => {
        setLoading(true);
        try {
            const res = await api.getHealthTips(cat === 'All' ? null : cat);
            if (res.success) setTips(res.data);
        } catch { /* ignore */ } finally { setLoading(false); }
    };

    const fetchAdvice = async () => {
        try {
            const res = await api.getAppointments(patientId);
            if (res.success && res.data.length > 0) {
                const withRemarks = res.data.filter(a => a.remarks && a.remarks.trim() !== '');
                if (withRemarks.length > 0) {
                    setLatestDoctorAdvice(withRemarks[0]); // most recent
                }
            }
        } catch { /* ignore */ }
    };

    const fetchWellnessInsights = async () => {
        try {
            const res = await api.getWellness(patientId);
            if (res.success && res.data.length > 0) {
                const latest = res.data[0]; // Assuming ordered by DESC or latest is top. Wait, backend says tracker_date DESC.
                const adviceList = [];
                if (latest.sleep_hours < 7) adviceList.push("Recorded sleep is below the recommended 7 hours. Maintain 7-8 hours of continuous sleep for optimal cognitive function.");
                if (latest.water_intake_liters < 2) adviceList.push("Hydration levels are low. Aim to consume at least 2 to 3 liters of water per day to maintain metabolic balance.");
                if (latest.stress_level === 'High' || latest.stress_level === 'Very High') adviceList.push("Elevated stress levels detected. Consider taking a 15-minute screen break or practicing deep breathing exercises.");
                if (latest.physical_activity_minutes < 30) adviceList.push("Low physical activity recorded. Incorporating a brisk 30-minute daily walk can significantly mitigate lethargy and cardiovascular risks.");
                if (latest.mood === 'Sad' || latest.mood === 'Anxious') adviceList.push("Negative mood state indicated. We encourage scheduling a brief consultation with a campus counselor if feelings of overwhelm persist.");
                
                if(adviceList.length === 0) adviceList.push("All tracked vital metrics are well within optimal ranges. Excellent maintenance of daily wellness equilibrium.");
                
                setWellnessAdvice({
                    date: latest.tracker_date,
                    adviceList
                });
            }
        } catch { /* ignore */ }
    };

    return (
        <AppLayout title="Health Tips">
            <div className="page-header">
                <h1>Health Tips &amp; Resources</h1>
                <p>Curated wellness guidance from the campus health team.</p>
            </div>

            {role !== 'admin' && latestDoctorAdvice && (
                <div className="card" style={{ marginBottom: 20, border: '2px solid var(--primary-dark)', background: '#f8fafc' }}>
                    <div className="card-header" style={{ background: 'var(--primary-light)' }}>
                        <h3 className="card-title" style={{ color: 'var(--primary-dark)' }}>
                            Personalized Clinical Advice
                        </h3>
                    </div>
                    <div className="card-body">
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
                            From your recent appointment with <strong>{latestDoctorAdvice.doctor_name}</strong> on {latestDoctorAdvice.appointment_date}:
                        </p>
                        <blockquote style={{
                            borderLeft: '4px solid var(--primary)', margin: 0, padding: '8px 16px',
                            background: '#fff', fontSize: 14, color: 'var(--text-primary)', fontStyle: 'italic', borderRadius: '0 4px 4px 0'
                        }}>
                            "{latestDoctorAdvice.remarks}"
                        </blockquote>
                    </div>
                </div>
            )}

            {role !== 'admin' && wellnessAdvice && (
                <div className="card" style={{ marginBottom: 20, border: '1px solid var(--border)', background: 'var(--surface)' }}>
                    <div className="card-header" style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                        <h3 className="card-title" style={{ color: 'var(--text-primary)' }}>
                            Smart Wellness Insights
                        </h3>
                    </div>
                    <div className="card-body">
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
                            Automated analysis derived from health log dated <strong>{wellnessAdvice.date}</strong>:
                        </p>
                        <ul style={{ margin: 0, paddingLeft: 20, color: 'var(--text-secondary)', fontSize: 14 }}>
                            {wellnessAdvice.adviceList.map((adv, i) => (
                                <li key={i} style={{ marginBottom: 8 }}>{adv}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', padding: '12px 16px' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                        Filter by Category:
                    </span>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {CATEGORIES.map(c => (
                            <button
                                key={c}
                                onClick={() => setCat(c)}
                                style={{
                                    padding: '5px 12px', borderRadius: 20, fontSize: 12.5, fontWeight: 600,
                                    cursor: 'pointer', border: '1px solid', transition: 'all .15s',
                                    background: category === c ? 'var(--primary)' : 'transparent',
                                    color: category === c ? '#fff' : 'var(--text-secondary)',
                                    borderColor: category === c ? 'var(--primary)' : 'var(--border)',
                                }}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                    <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={() => fetchTips(category)}>
                        Refresh
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="empty-state"><p>Loading tips from database...</p></div>
            ) : tips.length === 0 ? (
                <div className="empty-state">
                    <h3>No tips found</h3>
                    <p>Try selecting a different category.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, marginBottom: 24 }}>
                    {tips.map(tip => (
                        <div key={tip.tip_id} className="card" style={{ height: '100%' }}>
                            <div className="card-header" style={{ gap: 8 }}>
                                <h4 className="card-title" style={{ fontSize: 13.5, lineHeight: 1.4 }}>{tip.title}</h4>
                                <span className={`badge ${IMPORTANCE_BADGE[tip.importance_level] || 'badge-gray'}`} style={{ flexShrink: 0 }}>
                                    {tip.importance_level}
                                </span>
                            </div>
                            <div className="card-body">
                                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: '0 0 12px', lineHeight: 1.6 }}>
                                    {tip.description}
                                </p>
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                                    <span className="badge badge-purple">{tip.category}</span>
                                    <span className="badge badge-blue">{tip.target_audience}</span>
                                </div>
                                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
                                    By {tip.created_by} &nbsp;&middot;&nbsp; {tip.views_count} views
                                </p>
                                {tip.reference_source && (
                                    <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 4 }}>
                                        Source: {tip.reference_source}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Emergency Contacts</h3>
                </div>
                <div className="card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                        {[
                            { name: 'Emergency Services', number: '108 / 112', note: '' },
                            { name: 'Campus Health Center', number: '0416-2202000', note: '' },
                            { name: 'Mental Health Helpline', number: '9152987821', note: 'AASRA (24/7)' },
                            { name: 'Campus Counselor', number: '0416-2202108', note: '' },
                        ].map(c => (
                            <div key={c.name} style={{ background: '#f9fafb', border: '1px solid var(--border)', borderRadius: 8, padding: '14px 16px' }}>
                                <p style={{ margin: '0 0 4px', fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>{c.name}</p>
                                <p style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>{c.number}</p>
                                {c.note && <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>{c.note}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

export default HealthTips;
