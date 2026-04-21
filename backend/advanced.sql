CREATE OR REPLACE TRIGGER TRG_NO_SHOW_PENALTY_24BCE5045
AFTER UPDATE OF appointment_status ON APPOINTMENT_24BCE5045
FOR EACH ROW
WHEN (NEW.appointment_status = 'No-Show' AND OLD.appointment_status != 'No-Show')
DECLARE
    v_billing_id NUMBER;
BEGIN
    SELECT SEQ_BILLING_24BCE5045.NEXTVAL INTO v_billing_id FROM DUAL;
    
    INSERT INTO BILLING_24BCE5045 (
        billing_id, patient_id, consultation_fee, lab_fee, medication_fee,
        total_amount, payment_status, payment_method, transaction_id,
        billing_date, issued_by
    ) VALUES (
        v_billing_id,
        :NEW.patient_id,
        200, 0, 0, 200,
        'Unpaid', 'N/A', 'NO-SHOW-PENALTY',
        SYSDATE, 'System Trigger'
    );
END;
/

CREATE OR REPLACE VIEW DOCTOR_CLINICAL_VIEW_24BCE5045 AS
SELECT 
    p.patient_id,
    p.full_name AS patient_name,
    p.date_of_birth,
    p.gender,
    p.blood_group,
    p.medical_history,
    p.allergies,
    a.appointment_id,
    a.doctor_name,
    a.department,
    a.appointment_date,
    a.appointment_status,
    a.remarks AS doctor_remarks
FROM PATIENT_24BCE5045 p
JOIN APPOINTMENT_24BCE5045 a ON p.patient_id = a.patient_id;
/

EXIT;
