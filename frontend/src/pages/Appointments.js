import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import api from '../services/api';

const STATUS_BADGE = { Scheduled: 'badge-blue', Completed: 'badge-green', Cancelled: 'badge-red', 'No-Show': 'badge-orange' };
const DOCTORS_BY_DEPARTMENT = {
    'General Medicine': ['Dr. Ramesh Kumar', 'Dr. Savitha Sharma', 'Dr. T. Reddy'],
    'Pulmonology': ['Dr. Arvind Singh', 'Dr. N. Menon'],
    'Cardiology': ['Dr. Priya Desai', 'Dr. Anil Kapoor'],
    'Endocrinology': ['Dr. Meera Reddy'],
    'Diabetology': ['Dr. Sneha Patil'],
    'Orthopedics': ['Dr. Vikram Singh', 'Dr. Neha Gupta'],
    'Dermatology': ['Dr. Kavitha Menon'],
    'Neurology': ['Dr. Rajesh Iyer'],
    'Psychiatry': ['Dr. Alok Verma'],
    'ENT': ['Dr. Pooja Nanda']
};
const DEPARTMENTS = Object.keys(DOCTORS_BY_DEPARTMENT);

function Appointments() {
    const [appts, setAppts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [form, setForm] = useState({
        doctor_name: '', department: '', appointment_date: '',
        appointment_time: '', reason_for_visit: '', room_number: '',
        follow_up_required: 'No', remarks: ''
    });
    const [editForm, setEditForm] = useState(null);
    const patientId = parseInt(localStorage.getItem('patient_id') || '1');
    const role = localStorage.getItem('role') || 'user';

    useEffect(() => {
        fetchAppts();

        // Auto-refresh every 30 seconds so student sees admin updates
        const interval = setInterval(fetchAppts, 30000);

        // Also refresh instantly when user switches back to this tab
        const handleVisibility = () => {
            if (document.visibilityState === 'visible') fetchAppts();
        };
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, []); // eslint-disable-line

    const fetchAppts = async () => {
        setLoading(true);
        try {
            const res = role === 'admin'
                ? await api.getAllAppointments()
                : await api.getAppointments(patientId);
            if (res.success) {
                setAppts(res.data);
                setLastUpdated(new Date());
            } else {
                setMsg({ type: 'error', text: res.error });
            }
        } catch { setMsg({ type: 'error', text: 'Cannot reach backend.' }); }
        finally { setLoading(false); }
    };

    const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleBook = async (e) => {
        e.preventDefault(); setSaving(true); setMsg(null);
        try {
            const res = await api.addAppointment({
                ...form, patient_id: patientId, appointment_status: 'Scheduled'
            });
            if (res.success) {
                setMsg({ type: 'success', text: 'Appointment booked successfully.' });
                setModal(false);
                setForm({ doctor_name: '', department: '', appointment_date: '', appointment_time: '', reason_for_visit: '', room_number: '', follow_up_required: 'No', remarks: '' });
                fetchAppts();
            } else {
                setMsg({ type: 'error', text: res.error || 'Booking failed.' });
            }
        } catch { setMsg({ type: 'error', text: 'Error connecting to backend.' }); }
        finally { setSaving(false); }
    };

    const handleUpdate = async (e) => {
        e.preventDefault(); setSaving(true); setMsg(null);
        try {
            const res = await api.updateAppointment(editForm.appointment_id, {
                appointment_status: editForm.appointment_status,
                remarks: editForm.remarks
            });
            if (res.success) {
                if (editForm.test_name && editForm.test_name.trim()) {
                    await api.addDiagnosticTest({
                        patient_id: editForm.patient_id,
                        test_name: editForm.test_name,
                        test_type: 'Lab Test',
                        test_date: new Date().toISOString().split('T')[0],
                        doctor_review: editForm.doctor_name,
                        status: 'Pending'
                    });
                }
                
                if (editForm.medicine_name && editForm.medicine_name.trim()) {
                    await api.addMedication({
                        patient_id: editForm.patient_id,
                        medicine_name: editForm.medicine_name,
                        dosage: editForm.dosage || 'Standard',
                        frequency: editForm.frequency || '1x daily',
                        duration_days: parseInt(editForm.duration_days) || 7,
                        prescribed_by: editForm.doctor_name,
                        prescription_date: new Date().toISOString().split('T')[0],
                        expiry_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                        side_effects: '',
                        instructions: 'Follow doctor advice',
                        status: 'Active'
                    });
                }

                if (editForm.total_amount && parseInt(editForm.total_amount) > 0) {
                    await api.addBilling({
                        patient_id: editForm.patient_id,
                        consultation_fee: parseInt(editForm.consultation_fee) || 0,
                        lab_fee: parseInt(editForm.lab_fee) || 0,
                        medication_fee: parseInt(editForm.medication_fee) || 0,
                        total_amount: parseInt(editForm.total_amount) || 0,
                        payment_status: 'Unpaid',
                        payment_method: 'N/A',
                        transaction_id: 'PENDING',
                        payment_date: new Date().toISOString().split('T')[0],
                        issued_by: 'Admin'
                    });
                }

                setMsg({ type: 'success', text: 'Appointment components updated successfully.' });
                setEditModal(false);
                fetchAppts();
            } else {
                setMsg({ type: 'error', text: res.error || 'Update failed.' });
            }
        } catch { setMsg({ type: 'error', text: 'Error connecting to backend.' }); }
        finally { setSaving(false); }
    };

    const upcoming = appts.filter(a => a.appointment_status === 'Scheduled').length;
    const completed = appts.filter(a => a.appointment_status === 'Completed').length;
    const cancelled = appts.filter(a => a.appointment_status === 'Cancelled').length;

    return (
        <AppLayout title="Appointments">
            <div className="page-header">
                <h1>Appointments</h1>
                <p>Manage your clinic appointments and bookings.</p>
            </div>

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

            <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
                <div className="stat-card"><div className="stat-icon blue" /><div><div className="stat-value">{upcoming}</div><div className="stat-label">Upcoming</div></div></div>
                <div className="stat-card"><div className="stat-icon green" /><div><div className="stat-value">{completed}</div><div className="stat-label">Completed</div></div></div>
                <div className="stat-card"><div className="stat-icon red" /><div><div className="stat-value">{cancelled}</div><div className="stat-label">Cancelled</div></div></div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">
                        {role === 'admin' ? 'All Appointments' : `Appointments — Patient #${patientId}`}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {lastUpdated && (
                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                Updated {lastUpdated.toLocaleTimeString()}
                            </span>
                        )}
                        <button className="btn btn-ghost btn-sm" onClick={fetchAppts} disabled={loading}>
                            {loading ? 'Refreshing…' : '↻ Refresh'}
                        </button>
                        {role !== 'admin' && (
                            <button className="btn btn-primary btn-sm" onClick={() => setModal(true)}>+ Book Appointment</button>
                        )}
                    </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    {loading ? (
                        <div className="empty-state"><p>Loading...</p></div>
                    ) : appts.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon" style={{ fontSize: 32, color: 'var(--border)' }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                            </div>
                            <h3>No Appointments Found</h3>
                            <p>Book your first appointment using the button above.</p>
                        </div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Doctor</th><th>Department</th><th>Date</th><th>Time</th>
                                    <th>Status</th><th>Reason</th><th>Room</th><th>Follow-Up</th>
                                    <th>Prescription / Remarks</th>
                                    {role === 'admin' && <th>Action</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {appts.map((a, i) => (
                                    <tr key={i}>
                                        <td><strong>{a.doctor_name}</strong></td>
                                        <td>{a.department}</td>
                                        <td>{a.appointment_date}</td>
                                        <td>{a.appointment_time || '—'}</td>
                                        <td><span className={`badge ${STATUS_BADGE[a.appointment_status] || 'badge-gray'}`}>{a.appointment_status}</span></td>
                                        <td>{a.reason_for_visit || '—'}</td>
                                        <td>{a.room_number || '—'}</td>
                                        <td><span className={`badge ${a.follow_up_required === 'Yes' ? 'badge-orange' : 'badge-green'}`}>{a.follow_up_required}</span></td>
                                        <td>{a.remarks || '—'}</td>
                                        {role === 'admin' && (
                                            <td>
                                                <button className="btn btn-outline btn-sm" onClick={() => {
                                                    setEditForm({ ...a, remarks: a.remarks || '' });
                                                    setEditModal(true);
                                                }}>Edit</button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {modal && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
                    <div className="modal-box">
                        <div className="modal-header">
                            <h4 className="modal-title">Book New Appointment</h4>
                            <button className="modal-close" onClick={() => setModal(false)}>&#x2715;</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleBook}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Department <span className="req">*</span></label>
                                        <select className="form-control" name="department" value={form.department} onChange={(e) => setForm(p => ({ ...p, department: e.target.value, doctor_name: '' }))} required>
                                            <option value="">Select department</option>
                                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Doctor Name <span className="req">*</span></label>
                                        <select className="form-control" name="doctor_name" value={form.doctor_name} onChange={handleChange} required disabled={!form.department}>
                                            <option value="">Select doctor...</option>
                                            {form.department && DOCTORS_BY_DEPARTMENT[form.department]?.map(doc => <option key={doc} value={doc}>{doc}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Date <span className="req">*</span></label>
                                        <input className="form-control" type="date" name="appointment_date" value={form.appointment_date} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Time <span className="req">*</span></label>
                                        <input className="form-control" name="appointment_time" placeholder="10:00 AM" value={form.appointment_time} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Reason for Visit</label>
                                    <input className="form-control" name="reason_for_visit" placeholder="e.g. Routine check-up" value={form.reason_for_visit} onChange={handleChange} />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Remarks</label>
                                    <input className="form-control" name="remarks" placeholder="Any additional notes" value={form.remarks} onChange={handleChange} />
                                </div>
                                <div className="form-actions">
                                    <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Booking...' : 'Confirm Booking'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {editModal && editForm && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setEditModal(false)}>
                    <div className="modal-box">
                        <div className="modal-header">
                            <h4 className="modal-title">Update Case Status &amp; Prescription</h4>
                            <button className="modal-close" onClick={() => setEditModal(false)}>&#x2715;</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleUpdate}>
                                <div className="form-group">
                                    <label className="form-label">Update Status</label>
                                    <select className="form-control" value={editForm.appointment_status} onChange={e => setEditForm({ ...editForm, appointment_status: e.target.value })}>
                                        <option value="Scheduled">Scheduled</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                        <option value="No-Show">No-Show</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Doctor's Comments / Prescription</label>
                                    <textarea className="form-control" rows="4" placeholder="Enter diagnosis, prescription, or health tips here..." value={editForm.remarks} onChange={e => setEditForm({ ...editForm, remarks: e.target.value })}></textarea>
                                </div>
                                <div className="form-group" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: 12, borderRadius: 6, marginTop: 16 }}>
                                    <label className="form-label" style={{ color: '#166534', fontWeight: 600 }}>Prescribe Diagnostic Test (Optional)</label>
                                    <input className="form-control" placeholder="e.g. Complete Blood Count (CBC)" value={editForm.test_name || ''} onChange={e => setEditForm({ ...editForm, test_name: e.target.value })} />
                                </div>
                                <div className="form-group" style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: 12, borderRadius: 6, marginTop: 16 }}>
                                    <label className="form-label" style={{ color: '#1e40af', fontWeight: 600 }}>Prescribe Medication (Optional)</label>
                                    <input className="form-control" placeholder="Medicine Name (e.g. Paracetamol)" value={editForm.medicine_name || ''} onChange={e => setEditForm({ ...editForm, medicine_name: e.target.value })} style={{ marginBottom: 8 }} />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                                        <input className="form-control" placeholder="Dosage (e.g. 500mg)" value={editForm.dosage || ''} onChange={e => setEditForm({ ...editForm, dosage: e.target.value })} />
                                        <input className="form-control" placeholder="Frequency (e.g. 2x/day)" value={editForm.frequency || ''} onChange={e => setEditForm({ ...editForm, frequency: e.target.value })} />
                                        <input className="form-control" placeholder="Duration (Days)" type="number" value={editForm.duration_days || ''} onChange={e => setEditForm({ ...editForm, duration_days: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-group" style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', padding: 12, borderRadius: 6, marginTop: 16 }}>
                                    <label className="form-label" style={{ color: '#5b21b6', fontWeight: 600 }}>Generate Bill (Optional)</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                        <div>
                                            <label style={{ fontSize: 11, color: '#6b21a8' }}>Consultation Fee</label>
                                            <input className="form-control" type="number" placeholder="₹" value={editForm.consultation_fee || ''} onChange={e => setEditForm({ ...editForm, consultation_fee: e.target.value, total_amount: (parseInt(e.target.value||0) + parseInt(editForm.lab_fee||0) + parseInt(editForm.medication_fee||0)) })} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: 11, color: '#6b21a8' }}>Lab Fee</label>
                                            <input className="form-control" type="number" placeholder="₹" value={editForm.lab_fee || ''} onChange={e => setEditForm({ ...editForm, lab_fee: e.target.value, total_amount: (parseInt(editForm.consultation_fee||0) + parseInt(e.target.value||0) + parseInt(editForm.medication_fee||0)) })} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                                        <div>
                                            <label style={{ fontSize: 11, color: '#6b21a8' }}>Medication Fee</label>
                                            <input className="form-control" type="number" placeholder="₹" value={editForm.medication_fee || ''} onChange={e => setEditForm({ ...editForm, medication_fee: e.target.value, total_amount: (parseInt(editForm.consultation_fee||0) + parseInt(editForm.lab_fee||0) + parseInt(e.target.value||0)) })} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: 11, color: '#6b21a8', fontWeight: 'bold' }}>Total Amount</label>
                                            <input className="form-control" type="number" placeholder="Total" value={editForm.total_amount || ''} readOnly style={{ background: '#eadeff', fontWeight: 'bold' }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-actions" style={{ marginTop: 24 }}>
                                    <button type="button" className="btn btn-ghost" onClick={() => setEditModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Updates'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

export default Appointments;
