import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import api from '../services/api';

const MED_STATUS_BADGE = { Active: 'badge-green', Completed: 'badge-blue', Discontinued: 'badge-red' };
const TEST_STATUS_BADGE = { Reviewed: 'badge-green', Pending: 'badge-orange', Completed: 'badge-blue' };
const PAY_STATUS_BADGE = { Paid: 'badge-green', Unpaid: 'badge-red', Partial: 'badge-orange', Waived: 'badge-purple' };

function Medications() {
    const [tab, setTab] = useState('meds');
    const [meds, setMeds] = useState([]);
    const [tests, setTests] = useState([]);
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editStatusModal, setEditStatusModal] = useState(false);
    const [statusType, setStatusType] = useState('');
    const [statusId, setStatusId] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [statusMsg, setStatusMsg] = useState(null);
    const [saving, setSaving] = useState(false);
    
    const patientId = parseInt(localStorage.getItem('patient_id') || '1');
    const role = localStorage.getItem('role') || 'user';

    useEffect(() => { fetchAll(); }, []); // eslint-disable-line

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [mRes, tRes, bRes] = await Promise.all([
                api.getMedications(patientId),
                api.getDiagnosticTests(patientId),
                api.getBilling(patientId),
            ]);
            if (mRes.success) setMeds(mRes.data);
            if (tRes.success) setTests(tRes.data);
            if (bRes.success) setBills(bRes.data);
        } catch { /* ignore */ } finally { setLoading(false); }
    };

    const handleStatusUpdate = async (e) => {
        e.preventDefault(); setSaving(true); setStatusMsg(null);
        try {
            let res;
            if (statusType === 'meds') res = await api.updateMedicationStatus(statusId, newStatus);
            else if (statusType === 'tests') res = await api.updateDiagnosticTestStatus(statusId, newStatus);
            else if (statusType === 'billing') res = await api.updateBillingStatus(statusId, newStatus);

            if (res.success) {
                setEditStatusModal(false);
                fetchAll();
            } else {
                setStatusMsg({ type: 'error', text: res.error || 'Update failed.' });
            }
        } catch { setStatusMsg({ type: 'error', text: 'Error connecting to backend.' }); }
        finally { setSaving(false); }
    };

    const totalBilled = bills.reduce((s, b) => s + (b.total_amount || 0), 0);

    const TABS = [
        { key: 'meds', label: 'Medications' },
        { key: 'tests', label: 'Diagnostic Tests' },
        { key: 'billing', label: 'Billing' },
    ];

    return (
        <AppLayout title="Medical Records">
            <div className="page-header">
                <h1>Medical Records &mdash; Patient #{patientId}</h1>
                <p>Prescriptions, diagnostic test results, and billing information.</p>
            </div>

            <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
                <div className="stat-card"><div className="stat-icon orange" /><div><div className="stat-value">{meds.length}</div><div className="stat-label">Prescriptions</div></div></div>
                <div className="stat-card"><div className="stat-icon cyan" /><div><div className="stat-value">{tests.length}</div><div className="stat-label">Diagnostic Tests</div></div></div>
                <div className="stat-card"><div className="stat-icon purple" /><div><div className="stat-value">&#8377;{totalBilled.toLocaleString()}</div><div className="stat-label">Total Billed</div></div></div>
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="tab-bar" style={{ margin: 0, border: 'none' }}>
                        {TABS.map(t => (
                            <button key={t.key} className={`tab-btn${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>
                                {t.label}
                            </button>
                        ))}
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={fetchAll}>Refresh</button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    {loading ? (
                        <div className="empty-state"><p>Loading...</p></div>
                    ) : (
                        <>
                            {tab === 'meds' && (
                                meds.length === 0
                                    ? <div className="empty-state"><h3>No medications found</h3></div>
                                    : <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Medicine</th><th>Dosage</th><th>Frequency</th><th>Duration</th>
                                                <th>Prescribed By</th><th>Rx Date</th><th>Expiry</th><th>Status</th><th>Side Effects</th>
                                                {role === 'admin' && <th>Action</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {meds.map((m, i) => (
                                                <tr key={i}>
                                                    <td><strong>{m.medicine_name}</strong></td>
                                                    <td>{m.dosage}</td>
                                                    <td>{m.frequency}</td>
                                                    <td>{m.duration_days} days</td>
                                                    <td>{m.prescribed_by}</td>
                                                    <td>{m.prescription_date}</td>
                                                    <td>{m.expiry_date}</td>
                                                    <td><span className={`badge ${MED_STATUS_BADGE[m.status] || 'badge-gray'}`}>{m.status}</span></td>
                                                    <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.side_effects || '—'}</td>
                                                    {role === 'admin' && (
                                                        <td>
                                                            <button className="btn btn-outline btn-sm" onClick={() => {
                                                                setStatusType('meds');
                                                                setStatusId(m.medication_id);
                                                                setNewStatus(m.status);
                                                                setEditStatusModal(true);
                                                            }}>Update Status</button>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                            )}

                            {tab === 'tests' && (
                                tests.length === 0
                                    ? <div className="empty-state"><h3>No test results found</h3></div>
                                    : <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Test Name</th><th>Type</th><th>Result</th><th>Normal Range</th>
                                                <th>Date</th><th>Lab</th><th>Technician</th><th>Status</th>
                                                {role === 'admin' && <th>Action</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tests.map((t, i) => (
                                                <tr key={i}>
                                                    <td><strong>{t.test_name}</strong></td>
                                                    <td>{t.test_type}</td>
                                                    <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.test_result}</td>
                                                    <td>{t.normal_range}</td>
                                                    <td>{t.test_date}</td>
                                                    <td>{t.lab_name}</td>
                                                    <td>{t.technician_name}</td>
                                                    <td><span className={`badge ${TEST_STATUS_BADGE[t.status] || 'badge-gray'}`}>{t.status}</span></td>
                                                    {role === 'admin' && (
                                                        <td>
                                                            <button className="btn btn-outline btn-sm" onClick={() => {
                                                                setStatusType('tests');
                                                                setStatusId(t.diagnostic_test_id);
                                                                setNewStatus(t.status);
                                                                setEditStatusModal(true);
                                                            }}>Update Status</button>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                            )}

                            {tab === 'billing' && (
                                bills.length === 0
                                    ? <div className="empty-state"><h3>No billing records found</h3></div>
                                    : <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Billing Date</th><th>Consultation</th><th>Lab Fee</th>
                                                <th>Medication Fee</th><th>Total</th><th>Status</th><th>Method</th><th>Issued By</th>
                                                {role === 'admin' && <th>Action</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bills.map((b, i) => (
                                                <tr key={i}>
                                                    <td>{b.billing_date}</td>
                                                    <td>&#8377;{b.consultation_fee ?? 0}</td>
                                                    <td>&#8377;{b.lab_fee ?? 0}</td>
                                                    <td>&#8377;{b.medication_fee ?? 0}</td>
                                                    <td><strong>&#8377;{b.total_amount ?? 0}</strong></td>
                                                    <td><span className={`badge ${PAY_STATUS_BADGE[b.payment_status] || 'badge-gray'}`}>{b.payment_status}</span></td>
                                                    <td>{b.payment_method || '—'}</td>
                                                    <td>{b.issued_by}</td>
                                                    {role === 'admin' && (
                                                        <td>
                                                            <button className="btn btn-outline btn-sm" onClick={() => {
                                                                setStatusType('billing');
                                                                setStatusId(b.billing_id);
                                                                setNewStatus(b.payment_status);
                                                                setEditStatusModal(true);
                                                            }}>Update Status</button>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                            )}
                        </>
                    )}
                </div>
            </div>

            {editStatusModal && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setEditStatusModal(false)}>
                    <div className="modal-box">
                        <div className="modal-header">
                            <h4 className="modal-title">Update Status</h4>
                            <button className="modal-close" onClick={() => setEditStatusModal(false)}>&#x2715;</button>
                        </div>
                        <div className="modal-body">
                            {statusMsg && <div style={{ color: 'red', marginBottom: 12 }}>{statusMsg.text}</div>}
                            <form onSubmit={handleStatusUpdate}>
                                <div className="form-group">
                                    <label className="form-label">New Status</label>
                                    <select className="form-control" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                                        {statusType === 'meds' && (
                                            <>
                                                <option value="Active">Active</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Discontinued">Discontinued</option>
                                            </>
                                        )}
                                        {statusType === 'tests' && (
                                            <>
                                                <option value="Pending">Pending</option>
                                                <option value="Reviewed">Reviewed</option>
                                                <option value="Completed">Completed</option>
                                            </>
                                        )}
                                        {statusType === 'billing' && (
                                            <>
                                                <option value="Unpaid">Unpaid</option>
                                                <option value="Partial">Partial</option>
                                                <option value="Paid">Paid</option>
                                                <option value="Waived">Waived</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                                <div className="form-actions">
                                    <button type="button" className="btn btn-ghost" onClick={() => setEditStatusModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Updating...' : 'Confirm Update'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

export default Medications;
