import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import api from '../services/api';

const PAY_BADGE = { Paid: 'badge-green', Unpaid: 'badge-red', Partial: 'badge-orange', Waived: 'badge-purple' };
const APPT_BADGE = { Scheduled: 'badge-blue', Completed: 'badge-green', Cancelled: 'badge-red', 'No-Show': 'badge-orange' };

function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [patients, setPatients] = useState([]);
    const [appts, setAppts] = useState([]);
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('overview');

    useEffect(() => { loadAll(); }, []);

    const loadAll = async () => {
        setLoading(true);
        try {
            const [sRes, pRes, aRes, bRes] = await Promise.all([
                api.getStats(),
                api.getAllPatients(),
                api.getAllAppointments(),
                fetch(`http://${window.location.hostname}:5000/api/billing`).then(r => r.json()),
            ]);
            if (sRes.success) setStats(sRes.data);
            if (pRes.success) setPatients(pRes.data);
            if (aRes.success) setAppts(aRes.data);
            if (bRes.success) setBills(bRes.data);
        } catch { /* ignore */ } finally { setLoading(false); }
    };

    const totalRevenue = bills.filter(b => b.payment_status === 'Paid').reduce((s, b) => s + (b.total_amount || 0), 0);
    const unpaidCount = bills.filter(b => b.payment_status === 'Unpaid').length;

    const STAT_CARDS = [
        { label: 'Total Patients', key: 'total_patients', color: 'blue' },
        { label: 'Total Appointments', key: 'total_appointments', color: 'green' },
        { label: 'Active Medications', key: 'total_medications', color: 'orange' },
        { label: 'Diagnostic Tests', key: 'total_tests', color: 'cyan' },
        { label: 'Revenue (Paid)', value: `\u20B9${totalRevenue.toLocaleString()}`, color: 'green' },
        { label: 'Unpaid Bills', value: String(unpaidCount), color: 'red' },
        { label: 'Health Tips', key: 'total_tips', color: 'purple' },
        { label: 'Scheduled Today', key: 'scheduled_appointments', color: 'blue' },
    ];

    const TABS = [
        { key: 'overview', label: 'Overview' },
        { key: 'patients', label: 'Patients' },
        { key: 'appointments', label: 'Appointments' },
        { key: 'billing', label: 'Billing' },
    ];

    return (
        <AppLayout title="Admin Panel">
            <div className="page-header">
                <h1>Administration Panel</h1>
                <p>System-wide overview &mdash; patients, appointments, billing, and health metrics.</p>
            </div>

            <div className="stat-grid" style={{ marginBottom: 24 }}>
                {STAT_CARDS.map((s, i) => (
                    <div className="stat-card" key={i}>
                        <div className={`stat-icon ${s.color}`} />
                        <div>
                            <div className="stat-value">
                                {loading ? '—' : (s.value !== undefined ? s.value : (stats?.[s.key] ?? '—'))}
                            </div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/patients')}>Manage Patients</button>
                <button className="btn btn-outline btn-sm" onClick={() => navigate('/appointments')}>View Appointments</button>
                <button className="btn btn-outline btn-sm" onClick={() => navigate('/medications')}>Medical Records</button>
                <button className="btn btn-outline btn-sm" onClick={() => navigate('/health-tips')}>Health Tips</button>
                <button className="btn btn-ghost btn-sm" onClick={loadAll}>Refresh All</button>
            </div>

            <div className="tab-bar">
                {TABS.map(t => (
                    <button key={t.key} className={`tab-btn${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Recent Patients</h3>
                            <button className="btn btn-outline btn-sm" onClick={() => navigate('/patients')}>View All</button>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="data-table">
                                <thead><tr><th>Name</th><th>Department</th><th>Year</th><th>Blood</th></tr></thead>
                                <tbody>
                                    {patients.slice(0, 5).map((p, i) => (
                                        <tr key={i}>
                                            <td><strong>{p.first_name} {p.last_name}</strong></td>
                                            <td>{p.department || '—'}</td>
                                            <td>{p.year_of_study ? `Y${p.year_of_study}` : '—'}</td>
                                            <td>{p.blood_group || '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-header"><h3 className="card-title">Upcoming Appointments</h3></div>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="data-table">
                                <thead><tr><th>Patient #</th><th>Doctor</th><th>Date</th><th>Status</th></tr></thead>
                                <tbody>
                                    {appts.filter(a => a.appointment_status === 'Scheduled').slice(0, 5).map((a, i) => (
                                        <tr key={i}>
                                            <td>#{a.patient_id}</td>
                                            <td>{a.doctor_name}</td>
                                            <td>{a.appointment_date}</td>
                                            <td><span className={`badge ${APPT_BADGE[a.appointment_status] || 'badge-gray'}`}>{a.appointment_status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {tab === 'patients' && (
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">All Patients ({patients.length})</h3>
                        <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>+ Add Patient</button>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr><th>ID</th><th>Name</th><th>Email</th><th>Gender</th><th>Blood</th><th>Department</th><th>Year</th><th>Registered</th></tr>
                            </thead>
                            <tbody>
                                {patients.map((p, i) => (
                                    <tr key={i}>
                                        <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>#{p.patient_id}</td>
                                        <td><strong>{p.first_name} {p.last_name}</strong></td>
                                        <td>{p.email}</td>
                                        <td>
                                            <span className={`badge ${p.gender === 'Male' ? 'badge-blue' : p.gender === 'Female' ? 'badge-purple' : 'badge-gray'}`}>
                                                {p.gender}
                                            </span>
                                        </td>
                                        <td>{p.blood_group || '—'}</td>
                                        <td>{p.department || '—'}</td>
                                        <td>{p.year_of_study ? `Year ${p.year_of_study}` : '—'}</td>
                                        <td>{p.registration_date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === 'appointments' && (
                <div className="card">
                    <div className="card-header"><h3 className="card-title">All Appointments ({appts.length})</h3></div>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr><th>Patient #</th><th>Doctor</th><th>Department</th><th>Date</th><th>Time</th><th>Status</th><th>Follow-Up</th></tr>
                            </thead>
                            <tbody>
                                {appts.map((a, i) => (
                                    <tr key={i}>
                                        <td>#{a.patient_id}</td>
                                        <td><strong>{a.doctor_name}</strong></td>
                                        <td>{a.department}</td>
                                        <td>{a.appointment_date}</td>
                                        <td>{a.appointment_time || '—'}</td>
                                        <td><span className={`badge ${APPT_BADGE[a.appointment_status] || 'badge-gray'}`}>{a.appointment_status}</span></td>
                                        <td><span className={`badge ${a.follow_up_required === 'Yes' ? 'badge-orange' : 'badge-green'}`}>{a.follow_up_required}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === 'billing' && (
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">All Billing Records ({bills.length})</h3>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                            Total Revenue: <strong style={{ color: 'var(--success)' }}>&#8377;{totalRevenue.toLocaleString()}</strong>
                        </div>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr><th>Patient #</th><th>Date</th><th>Consultation</th><th>Lab</th><th>Medication</th><th>Total</th><th>Status</th><th>Method</th><th>Issued By</th></tr>
                            </thead>
                            <tbody>
                                {bills.map((b, i) => (
                                    <tr key={i}>
                                        <td>#{b.patient_id}</td>
                                        <td>{b.billing_date}</td>
                                        <td>&#8377;{b.consultation_fee ?? 0}</td>
                                        <td>&#8377;{b.lab_fee ?? 0}</td>
                                        <td>&#8377;{b.medication_fee ?? 0}</td>
                                        <td><strong>&#8377;{b.total_amount ?? 0}</strong></td>
                                        <td><span className={`badge ${PAY_BADGE[b.payment_status] || 'badge-gray'}`}>{b.payment_status}</span></td>
                                        <td>{b.payment_method || '—'}</td>
                                        <td>{b.issued_by}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

export default AdminDashboard;
