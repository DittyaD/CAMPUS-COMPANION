import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import api from '../services/api';

const BLOOD_BADGE = {
    'O+': 'badge-red', 'O-': 'badge-orange', 'A+': 'badge-blue', 'A-': 'badge-cyan',
    'B+': 'badge-green', 'B-': 'badge-cyan', 'AB+': 'badge-purple', 'AB-': 'badge-purple'
};

function Patients() {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => { fetchPatients(); }, []);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const res = await api.getAllPatients();
            if (res.success) setPatients(res.data);
        } catch { /* ignore */ } finally { setLoading(false); }
    };

    const filtered = patients.filter(p =>
        `${p.first_name} ${p.last_name} ${p.email} ${p.department}`
            .toLowerCase().includes(search.toLowerCase())
    );

    const depts = [...new Set(patients.map(p => p.department).filter(Boolean))].length;
    const males = patients.filter(p => p.gender === 'Male').length;
    const females = patients.filter(p => p.gender === 'Female').length;

    return (
        <AppLayout title="Patient Directory">
            <div className="page-header">
                <h1>All Patients</h1>
                <p>View and manage registered student health records.</p>
            </div>

            <div className="stat-grid" style={{ marginBottom: 20 }}>
                <div className="stat-card"><div className="stat-icon blue" /><div><div className="stat-value">{patients.length}</div><div className="stat-label">Total Patients</div></div></div>
                <div className="stat-card"><div className="stat-icon green" /><div><div className="stat-value">{depts}</div><div className="stat-label">Departments</div></div></div>
                <div className="stat-card"><div className="stat-icon blue" /><div><div className="stat-value">{males}</div><div className="stat-label">Male</div></div></div>
                <div className="stat-card"><div className="stat-icon purple" /><div><div className="stat-value">{females}</div><div className="stat-label">Female</div></div></div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Patient Directory</h3>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <input
                            className="form-control"
                            style={{ width: 220 }}
                            placeholder="Search patients..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <button className="btn btn-ghost btn-sm" onClick={fetchPatients}>Refresh</button>
                        <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>+ Add Patient</button>
                    </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    {loading ? (
                        <div className="empty-state"><p>Loading patients...</p></div>
                    ) : filtered.length === 0 ? (
                        <div className="empty-state"><h3>No patients found</h3></div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>#</th><th>Name</th><th>Email</th><th>Contact</th>
                                    <th>Gender</th><th>Blood</th><th>Department</th>
                                    <th>Year</th><th>DOB</th><th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((p, i) => (
                                    <tr key={i}>
                                        <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{p.patient_id}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                                                <div style={{
                                                    width: 32, height: 32, borderRadius: '50%',
                                                    background: 'var(--primary-light)', color: 'var(--primary)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontWeight: 700, fontSize: 13, flexShrink: 0
                                                }}>
                                                    {p.first_name[0]}{p.last_name[0]}
                                                </div>
                                                <strong>{p.first_name} {p.last_name}</strong>
                                            </div>
                                        </td>
                                        <td>{p.email}</td>
                                        <td>{p.contact_number}</td>
                                        <td>
                                            <span className={`badge ${p.gender === 'Male' ? 'badge-blue' : p.gender === 'Female' ? 'badge-purple' : 'badge-gray'}`}>
                                                {p.gender}
                                            </span>
                                        </td>
                                        <td>
                                            {p.blood_group
                                                ? <span className={`badge ${BLOOD_BADGE[p.blood_group] || 'badge-gray'}`}>{p.blood_group}</span>
                                                : '—'}
                                        </td>
                                        <td>{p.department || '—'}</td>
                                        <td>{p.year_of_study ? `Year ${p.year_of_study}` : '—'}</td>
                                        <td>{p.date_of_birth}</td>
                                        <td>
                                            <button className="btn btn-outline btn-sm" onClick={() => {
                                                localStorage.setItem('patient_id', String(p.patient_id));
                                                localStorage.setItem('patient_name', `${p.first_name} ${p.last_name}`);
                                                navigate('/dashboard');
                                            }}>
                                                View
                                            </button>
                                        </td>
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

export default Patients;
