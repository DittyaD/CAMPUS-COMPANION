"""
============================================================
  CAMPUS HEALTH AND WELLNESS COMPANION
  Flask Backend - REST API
  Database: Oracle 21c XE  |  Roll: 24BCE5045
============================================================
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import oracledb
import os
import datetime
import hashlib


app = Flask(__name__)
CORS(app) 

# Oracle DB Connection Settings
DB_USER     = "system"
DB_PASSWORD = "12345"
DB_DSN      = "localhost:1521/XE"   

def get_db_connection():
    """Create and return a new Oracle DB connection."""
    connection = oracledb.connect(
        user=DB_USER,
        password=DB_PASSWORD,
        dsn=DB_DSN
    )
    return connection


def run_migrations():
    """Ensure the DB schema is up to date. Safe to run on every startup."""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        try:
            cur.execute("ALTER TABLE PATIENT_24BCE5045 ADD (password_hash VARCHAR2(64))")
            conn.commit()
            print("[Migration] password_hash column added to PATIENT_24BCE5045.")
        except Exception as e:
            if "ORA-01430" in str(e):
                print("[Migration] password_hash column already exists. Skipping.")
            else:
                print("[Migration] Warning:", e)
        cur.close()
        conn.close()
    except Exception as e:
        print("[Migration] Could not connect for migration:", e)

run_migrations()


#  UTILITY HELPERS

def rows_to_dict(cursor):
    """Convert oracledb cursor rows to a list of dicts (handles datetime)."""
    columns = [col[0].lower() for col in cursor.description]
    result = []
    for row in cursor.fetchall():
        record = {}
        for col, val in zip(columns, row):
            if isinstance(val, (datetime.datetime, datetime.date)):
                record[col] = val.strftime('%Y-%m-%d')
            else:
                record[col] = val
        result.append(record)
    return result


# ──────────────────────────────────────────────────────────────
#  ROOT ENDPOINT
# ──────────────────────────────────────────────────────────────
@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "project": "Campus Health and Wellness Companion",
        "student": "24BCE5045",
        "database": "Oracle 11g",
        "status": "Backend Running ✅"
    })


# ══════════════════════════════════════════════════════════════
#  1. PATIENT ROUTES  (PATIENT_24BCE5045)
# ══════════════════════════════════════════════════════════════

@app.route("/api/patients", methods=["GET"])
def get_all_patients():
    """Fetch all patients."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM PATIENT_24BCE5045 ORDER BY patient_id")
        patients = rows_to_dict(cursor)
        cursor.close()
        conn.close()
        return jsonify({"success": True, "data": patients, "count": len(patients)}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/patients/<int:patient_id>", methods=["GET"])
def get_patient(patient_id):
    """Fetch a single patient by ID."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM PATIENT_24BCE5045 WHERE patient_id = :id",
            {"id": patient_id}
        )
        patient = rows_to_dict(cursor)
        cursor.close()
        conn.close()
        if not patient:
            return jsonify({"success": False, "error": "Patient not found"}), 404
        return jsonify({"success": True, "data": patient[0]}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/patients", methods=["POST"])
def add_patient():
    """Insert a new patient using sequence."""
    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO PATIENT_24BCE5045 (
                patient_id, first_name, last_name, date_of_birth, gender,
                blood_group, contact_number, email, address,
                emergency_contact_name, emergency_contact_number,
                department, year_of_study, registration_date, password_hash
            ) VALUES (
                SEQ_PATIENT_24BCE5045.NEXTVAL,
                :first_name, :last_name, TO_DATE(:dob, 'YYYY-MM-DD'), :gender,
                :blood_group, :contact_number, :email, :address,
                :emergency_contact_name, :emergency_contact_number,
                :department, :year_of_study, SYSDATE, :password_hash
            )
        """, {
            "first_name":               data.get("first_name"),
            "last_name":                data.get("last_name"),
            "dob":                      data.get("date_of_birth"),
            "gender":                   data.get("gender"),
            "blood_group":              data.get("blood_group"),
            "contact_number":           data.get("contact_number"),
            "email":                    data.get("email"),
            "address":                  data.get("address"),
            "emergency_contact_name":   data.get("emergency_contact_name"),
            "emergency_contact_number": data.get("emergency_contact_number"),
            "department":               data.get("department"),
            "year_of_study":            data.get("year_of_study"),
            "password_hash":            hashlib.sha256((data.get("password") or "").encode()).hexdigest()
        })
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"success": True, "message": "Patient added successfully"}), 201
    except Exception as e:
        error_message = str(e)
        if "ORA-00001" in error_message and "UNQ_EMAIL_PATIENT" in error_message:
            return jsonify({"success": False, "error": "This email address is already registered. Please log in or use a different email."}), 400
        return jsonify({"success": False, "error": error_message}), 500


@app.route("/api/patients/<int:patient_id>", methods=["PUT"])
def update_patient(patient_id):
    """Update patient details."""
    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE PATIENT_24BCE5045
            SET first_name      = :first_name,
                last_name       = :last_name,
                contact_number  = :contact_number,
                email           = :email,
                address         = :address,
                department      = :department,
                year_of_study   = :year_of_study
            WHERE patient_id = :id
        """, {
            "first_name":     data.get("first_name"),
            "last_name":      data.get("last_name"),
            "contact_number": data.get("contact_number"),
            "email":          data.get("email"),
            "address":        data.get("address"),
            "department":     data.get("department"),
            "year_of_study":  data.get("year_of_study"),
            "id":             patient_id
        })
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"success": True, "message": "Patient updated successfully"}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/patients/<int:patient_id>", methods=["DELETE"])
def delete_patient(patient_id):
    """Delete patient (CASCADE deletes child records)."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "DELETE FROM PATIENT_24BCE5045 WHERE patient_id = :id",
            {"id": patient_id}
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"success": True, "message": "Patient deleted successfully"}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ══════════════════════════════════════════════════════════════
#  2. MEDICAL HISTORY ROUTES  (MEDICAL_HISTORY_24BCE5045)
# ══════════════════════════════════════════════════════════════

@app.route("/api/medical-history", methods=["GET"])
def get_all_medical_history():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM MEDICAL_HISTORY_24BCE5045 ORDER BY medical_history_id")
        data = rows_to_dict(cursor)
        cursor.close(); conn.close()
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/medical-history/patient/<int:patient_id>", methods=["GET"])
def get_medical_history_by_patient(patient_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM MEDICAL_HISTORY_24BCE5045 WHERE patient_id = :id",
            {"id": patient_id}
        )
        data = rows_to_dict(cursor)
        cursor.close(); conn.close()
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/medical-history", methods=["POST"])
def add_medical_history():
    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO MEDICAL_HISTORY_24BCE5045 (
                medical_history_id, patient_id, chronic_conditions, allergies,
                past_surgeries, ongoing_treatments, family_medical_history,
                vaccination_status, height_cm, weight_kg, bmi,
                blood_pressure, last_updated
            ) VALUES (
                SEQ_MEDICAL_HISTORY_24BCE5045.NEXTVAL,
                :patient_id, :chronic_conditions, :allergies,
                :past_surgeries, :ongoing_treatments, :family_medical_history,
                :vaccination_status, :height_cm, :weight_kg, :bmi,
                :blood_pressure, SYSDATE
            )
        """, {
            "patient_id":            data.get("patient_id"),
            "chronic_conditions":    data.get("chronic_conditions"),
            "allergies":             data.get("allergies"),
            "past_surgeries":        data.get("past_surgeries"),
            "ongoing_treatments":    data.get("ongoing_treatments"),
            "family_medical_history":data.get("family_medical_history"),
            "vaccination_status":    data.get("vaccination_status"),
            "height_cm":             data.get("height_cm"),
            "weight_kg":             data.get("weight_kg"),
            "bmi":                   data.get("bmi"),
            "blood_pressure":        data.get("blood_pressure")
        })
        conn.commit()
        cursor.close(); conn.close()
        return jsonify({"success": True, "message": "Medical history added"}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ══════════════════════════════════════════════════════════════
#  3. MEDICATION ROUTES  (MEDICATION_24BCE5045)
# ══════════════════════════════════════════════════════════════

@app.route("/api/medications", methods=["GET"])
def get_all_medications():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM MEDICATION_24BCE5045 ORDER BY medication_id")
        data = rows_to_dict(cursor)
        cursor.close(); conn.close()
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/medications/patient/<int:patient_id>", methods=["GET"])
def get_medications_by_patient(patient_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM MEDICATION_24BCE5045 WHERE patient_id = :id ORDER BY prescription_date DESC",
            {"id": patient_id}
        )
        data = rows_to_dict(cursor)
        cursor.close(); conn.close()
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/medications", methods=["POST"])
def add_medication():
    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO MEDICATION_24BCE5045 (
                medication_id, patient_id, medicine_name, dosage, frequency,
                duration_days, prescribed_by, prescription_date, expiry_date,
                side_effects, instructions, status
            ) VALUES (
                SEQ_MEDICATION_24BCE5045.NEXTVAL,
                :patient_id, :medicine_name, :dosage, :frequency,
                :duration_days, :prescribed_by,
                TO_DATE(:prescription_date, 'YYYY-MM-DD'),
                TO_DATE(:expiry_date, 'YYYY-MM-DD'),
                :side_effects, :instructions, :status
            )
        """, {
            "patient_id":        data.get("patient_id"),
            "medicine_name":     data.get("medicine_name"),
            "dosage":            data.get("dosage"),
            "frequency":         data.get("frequency"),
            "duration_days":     data.get("duration_days"),
            "prescribed_by":     data.get("prescribed_by"),
            "prescription_date": data.get("prescription_date"),
            "expiry_date":       data.get("expiry_date"),
            "side_effects":      data.get("side_effects"),
            "instructions":      data.get("instructions"),
            "status":            data.get("status", "Active")
        })
        conn.commit()
        cursor.close(); conn.close()
        return jsonify({"success": True, "message": "Medication added"}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/medications/<int:med_id>", methods=["PUT"])
def update_medication_status(med_id):
    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE MEDICATION_24BCE5045 SET status = :status WHERE medication_id = :id",
            {"status": data.get("status"), "id": med_id}
        )
        conn.commit()
        cursor.close(); conn.close()
        return jsonify({"success": True, "message": "Medication status updated"}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ══════════════════════════════════════════════════════════════
#  4. DIAGNOSTIC TEST RESULTS  (DIAGNOSTIC_TEST_RESULT_24BCE5045)
# ══════════════════════════════════════════════════════════════

@app.route("/api/diagnostic-tests", methods=["GET"])
def get_all_diagnostic_tests():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM DIAGNOSTIC_TEST_RESULT_24BCE5045 ORDER BY diagnostic_test_id")
        data = rows_to_dict(cursor)
        cursor.close(); conn.close()
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/diagnostic-tests/patient/<int:patient_id>", methods=["GET"])
def get_diagnostic_tests_by_patient(patient_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM DIAGNOSTIC_TEST_RESULT_24BCE5045 WHERE patient_id = :id ORDER BY test_date DESC",
            {"id": patient_id}
        )
        data = rows_to_dict(cursor)
        cursor.close(); conn.close()
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/diagnostic-tests", methods=["POST"])
def add_diagnostic_test():
    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO DIAGNOSTIC_TEST_RESULT_24BCE5045 (
                diagnostic_test_id, patient_id, test_name, test_type, test_result,
                normal_range, test_date, lab_name, technician_name,
                doctor_review, remarks, status
            ) VALUES (
                SEQ_DIAGNOSTIC_TEST_24BCE5045.NEXTVAL,
                :patient_id, :test_name, :test_type, :test_result,
                :normal_range, TO_DATE(:test_date, 'YYYY-MM-DD'),
                :lab_name, :technician_name, :doctor_review, :remarks, :status
            )
        """, {
            "patient_id":      data.get("patient_id"),
            "test_name":       data.get("test_name"),
            "test_type":       data.get("test_type"),
            "test_result":     data.get("test_result"),
            "normal_range":    data.get("normal_range"),
            "test_date":       data.get("test_date"),
            "lab_name":        data.get("lab_name"),
            "technician_name": data.get("technician_name"),
            "doctor_review":   data.get("doctor_review"),
            "remarks":         data.get("remarks"),
            "status":          data.get("status", "Pending")
        })
        conn.commit()
        cursor.close(); conn.close()
        return jsonify({"success": True, "message": "Diagnostic test result added"}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/diagnostic-tests/<int:test_id>", methods=["PUT"])
def update_test_status(test_id):
    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE DIAGNOSTIC_TEST_RESULT_24BCE5045 SET status = :status WHERE diagnostic_test_id = :id",
            {"status": data.get("status"), "id": test_id}
        )
        conn.commit()
        cursor.close(); conn.close()
        return jsonify({"success": True, "message": "Test status updated"}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ══════════════════════════════════════════════════════════════
#  5. BILLING ROUTES  (BILLING_24BCE5045)
# ══════════════════════════════════════════════════════════════

@app.route("/api/billing", methods=["GET"])
def get_all_billing():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM BILLING_24BCE5045 ORDER BY billing_id")
        data = rows_to_dict(cursor)
        cursor.close(); conn.close()
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/billing/patient/<int:patient_id>", methods=["GET"])
def get_billing_by_patient(patient_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM BILLING_24BCE5045 WHERE patient_id = :id ORDER BY billing_date DESC",
            {"id": patient_id}
        )
        data = rows_to_dict(cursor)
        cursor.close(); conn.close()
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/billing", methods=["POST"])
def add_billing():
    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO BILLING_24BCE5045 (
                billing_id, patient_id, consultation_fee, lab_fee,
                medication_fee, total_amount, payment_status,
                payment_method, transaction_id, billing_date,
                payment_date, issued_by
            ) VALUES (
                SEQ_BILLING_24BCE5045.NEXTVAL,
                :patient_id, :consultation_fee, :lab_fee,
                :medication_fee, :total_amount, :payment_status,
                :payment_method, :transaction_id, SYSDATE,
                TO_DATE(:payment_date, 'YYYY-MM-DD'), :issued_by
            )
        """, {
            "patient_id":       data.get("patient_id"),
            "consultation_fee": data.get("consultation_fee", 0),
            "lab_fee":          data.get("lab_fee", 0),
            "medication_fee":   data.get("medication_fee", 0),
            "total_amount":     data.get("total_amount"),
            "payment_status":   data.get("payment_status", "Unpaid"),
            "payment_method":   data.get("payment_method"),
            "transaction_id":   data.get("transaction_id"),
            "payment_date":     data.get("payment_date"),
            "issued_by":        data.get("issued_by")
        })
        conn.commit()
        cursor.close(); conn.close()
        return jsonify({"success": True, "message": "Billing record added"}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/billing/<int:bill_id>", methods=["PUT"])
def update_billing_status(bill_id):
    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE BILLING_24BCE5045 SET payment_status = :status WHERE billing_id = :id",
            {"status": data.get("status"), "id": bill_id}
        )
        conn.commit()
        cursor.close(); conn.close()
        return jsonify({"success": True, "message": "Billing status updated"}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ══════════════════════════════════════════════════════════════
#  6. WELLNESS TRACKER ROUTES  (WELLNESS_TRACKER_24BCE5045)
# ══════════════════════════════════════════════════════════════

@app.route("/api/wellness", methods=["GET"])
def get_all_wellness():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM WELLNESS_TRACKER_24BCE5045 ORDER BY tracker_id")
        data = rows_to_dict(cursor)
        cursor.close(); conn.close()
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/wellness/patient/<int:patient_id>", methods=["GET"])
def get_wellness_by_patient(patient_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM WELLNESS_TRACKER_24BCE5045 WHERE patient_id = :id ORDER BY tracker_date DESC",
            {"id": patient_id}
        )
        data = rows_to_dict(cursor)
        cursor.close(); conn.close()
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/wellness", methods=["POST"])
def add_wellness_entry():
    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO WELLNESS_TRACKER_24BCE5045 (
                tracker_id, patient_id, mood, sleep_hours,
                water_intake_liters, physical_activity_minutes, stress_level,
                screen_time_hours, steps_count, calories_intake,
                meditation_minutes, tracker_date
            ) VALUES (
                SEQ_WELLNESS_TRACKER_24BCE5045.NEXTVAL,
                :patient_id, :mood, :sleep_hours,
                :water_intake_liters, :physical_activity_minutes, :stress_level,
                :screen_time_hours, :steps_count, :calories_intake,
                :meditation_minutes, SYSDATE
            )
        """, {
            "patient_id":                data.get("patient_id"),
            "mood":                      data.get("mood"),
            "sleep_hours":               data.get("sleep_hours"),
            "water_intake_liters":       data.get("water_intake_liters"),
            "physical_activity_minutes": data.get("physical_activity_minutes"),
            "stress_level":              data.get("stress_level"),
            "screen_time_hours":         data.get("screen_time_hours"),
            "steps_count":               data.get("steps_count"),
            "calories_intake":           data.get("calories_intake"),
            "meditation_minutes":        data.get("meditation_minutes")
        })
        conn.commit()
        cursor.close(); conn.close()
        return jsonify({"success": True, "message": "Wellness entry logged"}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ══════════════════════════════════════════════════════════════
#  7. APPOINTMENT ROUTES  (APPOINTMENT_24BCE5045)
# ══════════════════════════════════════════════════════════════

@app.route("/api/appointments", methods=["GET"])
def get_all_appointments():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM APPOINTMENT_24BCE5045 ORDER BY appointment_date")
        data = rows_to_dict(cursor)
        cursor.close(); conn.close()
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/appointments/patient/<int:patient_id>", methods=["GET"])
def get_appointments_by_patient(patient_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM APPOINTMENT_24BCE5045 WHERE patient_id = :id ORDER BY appointment_date DESC",
            {"id": patient_id}
        )
        data = rows_to_dict(cursor)
        cursor.close(); conn.close()
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/appointments", methods=["POST"])
def add_appointment():
    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO APPOINTMENT_24BCE5045 (
                appointment_id, patient_id, doctor_name, department,
                appointment_date, appointment_time, appointment_status,
                reason_for_visit, room_number, booking_date,
                follow_up_required, remarks
            ) VALUES (
                SEQ_APPOINTMENT_24BCE5045.NEXTVAL,
                :patient_id, :doctor_name, :department,
                TO_DATE(:appointment_date, 'YYYY-MM-DD'), :appointment_time,
                :appointment_status, :reason_for_visit, :room_number, SYSDATE,
                :follow_up_required, :remarks
            )
        """, {
            "patient_id":          data.get("patient_id"),
            "doctor_name":         data.get("doctor_name"),
            "department":          data.get("department"),
            "appointment_date":    data.get("appointment_date"),
            "appointment_time":    data.get("appointment_time"),
            "appointment_status":  data.get("appointment_status", "Scheduled"),
            "reason_for_visit":    data.get("reason_for_visit"),
            "room_number":         data.get("room_number"),
            "follow_up_required":  data.get("follow_up_required", "No"),
            "remarks":             data.get("remarks")
        })
        conn.commit()
        cursor.close(); conn.close()
        return jsonify({"success": True, "message": "Appointment booked"}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/appointments/<int:appointment_id>", methods=["PUT"])
def update_appointment_status(appointment_id):
    """Update appointment status."""
    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE APPOINTMENT_24BCE5045
            SET appointment_status = :status,
                remarks = :remarks
            WHERE appointment_id = :id
        """, {
            "status":  data.get("appointment_status"),
            "remarks": data.get("remarks"),
            "id":      appointment_id
        })
        conn.commit()
        cursor.close(); conn.close()
        return jsonify({"success": True, "message": "Appointment updated"}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ══════════════════════════════════════════════════════════════
#  8. HEALTH TIPS ROUTES  (HEALTH_TIPS_24BCE5045)
# ══════════════════════════════════════════════════════════════

@app.route("/api/health-tips", methods=["GET"])
def get_all_health_tips():
    """Get all active health tips, optionally filter by category."""
    category = request.args.get("category")
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        if category:
            cursor.execute(
                "SELECT * FROM HEALTH_TIPS_24BCE5045 WHERE status = 'Active' AND category = :cat ORDER BY created_date DESC",
                {"cat": category}
            )
        else:
            cursor.execute(
                "SELECT * FROM HEALTH_TIPS_24BCE5045 WHERE status = 'Active' ORDER BY created_date DESC"
            )
        data = rows_to_dict(cursor)
        cursor.close(); conn.close()
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/health-tips/<int:tip_id>", methods=["GET"])
def get_tip_by_id(tip_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        # Increment views count
        cursor.execute(
            "UPDATE HEALTH_TIPS_24BCE5045 SET views_count = views_count + 1 WHERE tip_id = :id",
            {"id": tip_id}
        )
        cursor.execute(
            "SELECT * FROM HEALTH_TIPS_24BCE5045 WHERE tip_id = :id",
            {"id": tip_id}
        )
        data = rows_to_dict(cursor)
        conn.commit()
        cursor.close(); conn.close()
        if not data:
            return jsonify({"success": False, "error": "Tip not found"}), 404
        return jsonify({"success": True, "data": data[0]}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/health-tips", methods=["POST"])
def add_health_tip():
    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO HEALTH_TIPS_24BCE5045 (
                tip_id, title, description, category, target_audience,
                created_by, created_date, last_updated,
                importance_level, reference_source, status, views_count
            ) VALUES (
                SEQ_HEALTH_TIPS_24BCE5045.NEXTVAL,
                :title, :description, :category, :target_audience,
                :created_by, SYSDATE, SYSDATE,
                :importance_level, :reference_source, :status, 0
            )
        """, {
            "title":            data.get("title"),
            "description":      data.get("description"),
            "category":         data.get("category"),
            "target_audience":  data.get("target_audience"),
            "created_by":       data.get("created_by"),
            "importance_level": data.get("importance_level", "Medium"),
            "reference_source": data.get("reference_source"),
            "status":           data.get("status", "Active")
        })
        conn.commit()
        cursor.close(); conn.close()
        return jsonify({"success": True, "message": "Health tip added"}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ══════════════════════════════════════════════════════════════
#  DASHBOARD STATS ROUTE
# ══════════════════════════════════════════════════════════════

@app.route("/api/dashboard/stats", methods=["GET"])
def get_dashboard_stats():
    """Return aggregate counts for all tables."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        stats = {}
        tables = {
            "total_patients":     "PATIENT_24BCE5045",
            "total_appointments": "APPOINTMENT_24BCE5045",
            "total_medications":  "MEDICATION_24BCE5045",
            "total_tests":        "DIAGNOSTIC_TEST_RESULT_24BCE5045",
            "total_bills":        "BILLING_24BCE5045",
            "total_tips":         "HEALTH_TIPS_24BCE5045"
        }
        for key, table in tables.items():
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            stats[key] = cursor.fetchone()[0]

        # Unpaid bills count
        cursor.execute("SELECT COUNT(*) FROM BILLING_24BCE5045 WHERE payment_status = 'Unpaid'")
        stats["unpaid_bills"] = cursor.fetchone()[0]

        # Scheduled appointments
        cursor.execute("SELECT COUNT(*) FROM APPOINTMENT_24BCE5045 WHERE appointment_status = 'Scheduled'")
        stats["scheduled_appointments"] = cursor.fetchone()[0]

        cursor.close(); conn.close()
        return jsonify({"success": True, "data": stats}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ══════════════════════════════════════════════════════════════
#  LOGIN ENDPOINT
# ══════════════════════════════════════════════════════════════

@app.route("/api/login", methods=["POST"])
def login():
    """Look up a patient by email. Returns patient info if found."""
    data = request.get_json()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password")

    # Hardcoded admin account
    if email == "admin@vit.ac.in":
        if password != "Password@0006":
            return jsonify({"success": False, "error": "Invalid email or password. Please try again."}), 401
        return jsonify({
            "success": True,
            "data": {
                "patient_id": 0,
                "name": "Administrator",
                "role": "admin"
            }
        }), 200

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        password_hash = hashlib.sha256((password or "").encode()).hexdigest()
        cursor.execute(
            """SELECT patient_id, first_name, last_name, password_hash 
               FROM PATIENT_24BCE5045 WHERE LOWER(email) = :email""",
            {"email": email}
        )
        row = cursor.fetchone()
        cursor.close()
        conn.close()

        if not row:
            return jsonify({"success": False, "error": "No account found with this email."}), 404

        stored_hash = row[3]
        # Support legacy accounts with no password set (null) — force reset
        if stored_hash is None:
            return jsonify({"success": False, "error": "No password set for this account. Please use Forgot Password to set one."}), 401

        if stored_hash != password_hash:
            return jsonify({"success": False, "error": "Invalid email or password. Please try again."}), 401

        return jsonify({
            "success": True,
            "data": {
                "patient_id": row[0],
                "name": f"{row[1]} {row[2]}",
                "role": "user"
            }
        }), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ══════════════════════════════════════════════════════════════
#  FORGOT PASSWORD — verify email exists, then reset
# ══════════════════════════════════════════════════════════════

@app.route("/api/forgot-password", methods=["POST"])
def forgot_password():
    """Check if email exists. Frontend then lets user set new password."""
    data = request.get_json()
    email = (data.get("email") or "").strip().lower()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT patient_id, first_name FROM PATIENT_24BCE5045 WHERE LOWER(email) = :email",
            {"email": email}
        )
        row = cursor.fetchone()
        cursor.close()
        conn.close()
        if not row:
            return jsonify({"success": False, "error": "No account found with this email address."}), 404
        return jsonify({"success": True, "patient_id": row[0], "name": row[1]}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/reset-password", methods=["POST"])
def reset_password():
    """Set a new password for the given patient_id."""
    data = request.get_json()
    patient_id = data.get("patient_id")
    new_password = data.get("new_password") or ""
    if len(new_password) < 6:
        return jsonify({"success": False, "error": "Password must be at least 6 characters."}), 400
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        password_hash = hashlib.sha256(new_password.encode()).hexdigest()
        cursor.execute(
            "UPDATE PATIENT_24BCE5045 SET password_hash = :h WHERE patient_id = :id",
            {"h": password_hash, "id": patient_id}
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"success": True, "message": "Password updated successfully."}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ──────────────────────────────────────────────
#  MAIN ENTRY POINT
# ──────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
