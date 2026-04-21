// ============================================================
//  Campus Health & Wellness Companion — API Service
//  All fetch calls to Flask backend are centralized here
// ============================================================

// Dynamically use whatever IP address the device connected via! 
// This makes it work flawlessly on home WiFi AND Mobile Hotspots without changes.
const BASE_URL = `http://${window.location.hostname}:5000/api`;
const HEADERS = { 'Content-Type': 'application/json' };

const api = {

    // ── Dashboard Stats ───────────────────────────────────────
    getStats: () =>
        fetch(`${BASE_URL}/dashboard/stats`).then(r => r.json()),

    // ── Patients ──────────────────────────────────────────────
    getAllPatients: () =>
        fetch(`${BASE_URL}/patients`).then(r => r.json()),

    getPatient: (id) =>
        fetch(`${BASE_URL}/patients/${id}`).then(r => r.json()),

    addPatient: (data) =>
        fetch(`${BASE_URL}/patients`, {
            method: 'POST', headers: HEADERS, body: JSON.stringify(data),
        }).then(r => r.json()),

    login: (email, password) =>
        fetch(`${BASE_URL}/login`, {
            method: 'POST', headers: HEADERS, body: JSON.stringify({ email, password }),
        }).then(r => r.json()),

    forgotPassword: (email) =>
        fetch(`${BASE_URL}/forgot-password`, {
            method: 'POST', headers: HEADERS, body: JSON.stringify({ email }),
        }).then(r => r.json()),

    resetPassword: (patient_id, new_password) =>
        fetch(`${BASE_URL}/reset-password`, {
            method: 'POST', headers: HEADERS, body: JSON.stringify({ patient_id, new_password }),
        }).then(r => r.json()),

    updatePatient: (id, data) =>
        fetch(`${BASE_URL}/patients/${id}`, {
            method: 'PUT', headers: HEADERS, body: JSON.stringify(data),
        }).then(r => r.json()),

    deletePatient: (id) =>
        fetch(`${BASE_URL}/patients/${id}`, { method: 'DELETE' }).then(r => r.json()),

    // ── Medical History ───────────────────────────────────────
    getMedicalHistory: (patientId) =>
        fetch(`${BASE_URL}/medical-history/patient/${patientId}`).then(r => r.json()),

    // ── Medications ───────────────────────────────────────────
    getMedications: (patientId) =>
        fetch(`${BASE_URL}/medications/patient/${patientId}`).then(r => r.json()),

    addMedication: (data) =>
        fetch(`${BASE_URL}/medications`, {
            method: 'POST', headers: HEADERS, body: JSON.stringify(data),
        }).then(r => r.json()),

    updateMedicationStatus: (id, status) =>
        fetch(`${BASE_URL}/medications/${id}`, {
            method: 'PUT', headers: HEADERS, body: JSON.stringify({ status })
        }).then(r => r.json()),

    // ── Diagnostic Tests ──────────────────────────────────────
    getDiagnosticTests: (patientId) =>
        fetch(`${BASE_URL}/diagnostic-tests/patient/${patientId}`).then(r => r.json()),

    addDiagnosticTest: (data) =>
        fetch(`${BASE_URL}/diagnostic-tests`, {
            method: 'POST', headers: HEADERS, body: JSON.stringify(data),
        }).then(r => r.json()),

    updateDiagnosticTestStatus: (id, status) =>
        fetch(`${BASE_URL}/diagnostic-tests/${id}`, {
            method: 'PUT', headers: HEADERS, body: JSON.stringify({ status })
        }).then(r => r.json()),

    // ── Billing ───────────────────────────────────────────────
    getBilling: (patientId) =>
        fetch(`${BASE_URL}/billing/patient/${patientId}`).then(r => r.json()),

    addBilling: (data) =>
        fetch(`${BASE_URL}/billing`, {
            method: 'POST', headers: HEADERS, body: JSON.stringify(data),
        }).then(r => r.json()),

    updateBillingStatus: (id, status) =>
        fetch(`${BASE_URL}/billing/${id}`, {
            method: 'PUT', headers: HEADERS, body: JSON.stringify({ status })
        }).then(r => r.json()),

    // ── Wellness Tracker ──────────────────────────────────────
    getWellness: (patientId) =>
        fetch(`${BASE_URL}/wellness/patient/${patientId}`).then(r => r.json()),

    addWellness: (data) =>
        fetch(`${BASE_URL}/wellness`, {
            method: 'POST', headers: HEADERS, body: JSON.stringify(data),
        }).then(r => r.json()),

    // ── Appointments ──────────────────────────────────────────
    getAllAppointments: () =>
        fetch(`${BASE_URL}/appointments`).then(r => r.json()),

    getAppointments: (patientId) =>
        fetch(`${BASE_URL}/appointments/patient/${patientId}`).then(r => r.json()),

    addAppointment: (data) =>
        fetch(`${BASE_URL}/appointments`, {
            method: 'POST', headers: HEADERS, body: JSON.stringify(data),
        }).then(r => r.json()),

    updateAppointment: (id, data) =>
        fetch(`${BASE_URL}/appointments/${id}`, {
            method: 'PUT', headers: HEADERS, body: JSON.stringify(data),
        }).then(r => r.json()),

    // ── Health Tips ───────────────────────────────────────────
    getHealthTips: (category) => {
        const url = category
            ? `${BASE_URL}/health-tips?category=${encodeURIComponent(category)}`
            : `${BASE_URL}/health-tips`;
        return fetch(url).then(r => r.json());
    },
};

export default api;
