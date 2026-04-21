-- ============================================================
--  CAMPUS HEALTH AND WELLNESS COMPANION
--  Oracle 11g SQL Script
--  Student Roll Number: 24BCE5045
--  Tables: 8 | Sequences: 8 | Sample Data Included
-- ============================================================

-- ============================================================
-- SECTION 1: DROP EXISTING TABLES (Run if re-initializing)
-- ============================================================
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE WELLNESS_TRACKER_24BCE5045 CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE APPOINTMENT_24BCE5045 CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE BILLING_24BCE5045 CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE DIAGNOSTIC_TEST_RESULT_24BCE5045 CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE MEDICATION_24BCE5045 CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE MEDICAL_HISTORY_24BCE5045 CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE HEALTH_TIPS_24BCE5045 CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE PATIENT_24BCE5045 CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL; END;
/

-- ============================================================
-- SECTION 2: DROP EXISTING SEQUENCES (Run if re-initializing)
-- ============================================================
BEGIN EXECUTE IMMEDIATE 'DROP SEQUENCE SEQ_PATIENT_24BCE5045'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP SEQUENCE SEQ_MEDICAL_HISTORY_24BCE5045'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP SEQUENCE SEQ_MEDICATION_24BCE5045'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP SEQUENCE SEQ_DIAGNOSTIC_TEST_24BCE5045'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP SEQUENCE SEQ_BILLING_24BCE5045'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP SEQUENCE SEQ_WELLNESS_TRACKER_24BCE5045'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP SEQUENCE SEQ_APPOINTMENT_24BCE5045'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP SEQUENCE SEQ_HEALTH_TIPS_24BCE5045'; EXCEPTION WHEN OTHERS THEN NULL; END;
/

-- ============================================================
-- SECTION 3: CREATE SEQUENCES (Auto-Increment Replacement)
-- ============================================================

CREATE SEQUENCE SEQ_PATIENT_24BCE5045
  START WITH 1
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;

CREATE SEQUENCE SEQ_MEDICAL_HISTORY_24BCE5045
  START WITH 1
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;

CREATE SEQUENCE SEQ_MEDICATION_24BCE5045
  START WITH 1
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;

CREATE SEQUENCE SEQ_DIAGNOSTIC_TEST_24BCE5045
  START WITH 1
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;

CREATE SEQUENCE SEQ_BILLING_24BCE5045
  START WITH 1
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;

CREATE SEQUENCE SEQ_WELLNESS_TRACKER_24BCE5045
  START WITH 1
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;

CREATE SEQUENCE SEQ_APPOINTMENT_24BCE5045
  START WITH 1
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;

CREATE SEQUENCE SEQ_HEALTH_TIPS_24BCE5045
  START WITH 1
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;

-- ============================================================
-- SECTION 4: CREATE TABLES
-- ============================================================

-- ------------------------------------------------------------
-- TABLE 1: PATIENT_24BCE5045  (Parent / Master Table)
-- ------------------------------------------------------------
CREATE TABLE PATIENT_24BCE5045 (
    patient_id                  NUMBER          NOT NULL,
    first_name                  VARCHAR2(50)    NOT NULL,
    last_name                   VARCHAR2(50)    NOT NULL,
    date_of_birth               DATE            NOT NULL,
    gender                      VARCHAR2(10)    NOT NULL,
    blood_group                 VARCHAR2(5),
    contact_number              VARCHAR2(15)    NOT NULL,
    email                       VARCHAR2(100)   NOT NULL,
    address                     VARCHAR2(200),
    emergency_contact_name      VARCHAR2(100),
    emergency_contact_number    VARCHAR2(15),
    department                  VARCHAR2(50),
    year_of_study               NUMBER,
    registration_date           DATE            DEFAULT SYSDATE,
    CONSTRAINT PK_PATIENT_24BCE5045
        PRIMARY KEY (patient_id),
    CONSTRAINT CHK_GENDER_24BCE5045
        CHECK (gender IN ('Male', 'Female', 'Other')),
    CONSTRAINT CHK_YEAR_24BCE5045
        CHECK (year_of_study BETWEEN 1 AND 5),
    CONSTRAINT UNQ_EMAIL_PATIENT_24BCE5045
        UNIQUE (email)
);

-- ------------------------------------------------------------
-- TABLE 2: MEDICAL_HISTORY_24BCE5045  (Child -> PATIENT)
-- ------------------------------------------------------------
CREATE TABLE MEDICAL_HISTORY_24BCE5045 (
    medical_history_id      NUMBER          NOT NULL,
    patient_id              NUMBER          NOT NULL,
    chronic_conditions      VARCHAR2(200),
    allergies               VARCHAR2(200),
    past_surgeries          VARCHAR2(200),
    ongoing_treatments      VARCHAR2(200),
    family_medical_history  VARCHAR2(200),
    vaccination_status      VARCHAR2(100),
    height_cm               NUMBER(5,2),
    weight_kg               NUMBER(5,2),
    bmi                     NUMBER(5,2),
    blood_pressure          VARCHAR2(20),
    last_updated            DATE            DEFAULT SYSDATE,
    CONSTRAINT PK_MED_HISTORY_24BCE5045
        PRIMARY KEY (medical_history_id),
    CONSTRAINT FK_MEDHISTORY_PATIENT_24BCE5045
        FOREIGN KEY (patient_id)
        REFERENCES PATIENT_24BCE5045(patient_id)
        ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- TABLE 3: MEDICATION_24BCE5045  (Child -> PATIENT)
-- ------------------------------------------------------------
CREATE TABLE MEDICATION_24BCE5045 (
    medication_id       NUMBER          NOT NULL,
    patient_id          NUMBER          NOT NULL,
    medicine_name       VARCHAR2(100)   NOT NULL,
    dosage              VARCHAR2(50),
    frequency           VARCHAR2(50),
    duration_days       NUMBER,
    prescribed_by       VARCHAR2(100),
    prescription_date   DATE            DEFAULT SYSDATE,
    expiry_date         DATE,
    side_effects        VARCHAR2(200),
    instructions        VARCHAR2(200),
    status              VARCHAR2(20)    DEFAULT 'Active',
    CONSTRAINT PK_MEDICATION_24BCE5045
        PRIMARY KEY (medication_id),
    CONSTRAINT FK_MEDICATION_PATIENT_24BCE5045
        FOREIGN KEY (patient_id)
        REFERENCES PATIENT_24BCE5045(patient_id)
        ON DELETE CASCADE,
    CONSTRAINT CHK_MED_STATUS_24BCE5045
        CHECK (status IN ('Active', 'Completed', 'Discontinued'))
);

-- ------------------------------------------------------------
-- TABLE 4: DIAGNOSTIC_TEST_RESULT_24BCE5045  (Child -> PATIENT)
-- ------------------------------------------------------------
CREATE TABLE DIAGNOSTIC_TEST_RESULT_24BCE5045 (
    diagnostic_test_id  NUMBER          NOT NULL,
    patient_id          NUMBER          NOT NULL,
    test_name           VARCHAR2(100)   NOT NULL,
    test_type           VARCHAR2(50),
    test_result         VARCHAR2(200),
    normal_range        VARCHAR2(100),
    test_date           DATE            DEFAULT SYSDATE,
    lab_name            VARCHAR2(100),
    technician_name     VARCHAR2(100),
    doctor_review       VARCHAR2(200),
    remarks             VARCHAR2(200),
    status              VARCHAR2(20)    DEFAULT 'Pending',
    CONSTRAINT PK_DIAG_TEST_24BCE5045
        PRIMARY KEY (diagnostic_test_id),
    CONSTRAINT FK_DIAGTEST_PATIENT_24BCE5045
        FOREIGN KEY (patient_id)
        REFERENCES PATIENT_24BCE5045(patient_id)
        ON DELETE CASCADE,
    CONSTRAINT CHK_DIAGTEST_STATUS_24BCE5045
        CHECK (status IN ('Pending', 'Reviewed', 'Completed'))
);

-- ------------------------------------------------------------
-- TABLE 5: BILLING_24BCE5045  (Child -> PATIENT)
-- ------------------------------------------------------------
CREATE TABLE BILLING_24BCE5045 (
    billing_id          NUMBER          NOT NULL,
    patient_id          NUMBER          NOT NULL,
    consultation_fee    NUMBER(10,2)    DEFAULT 0,
    lab_fee             NUMBER(10,2)    DEFAULT 0,
    medication_fee      NUMBER(10,2)    DEFAULT 0,
    total_amount        NUMBER(10,2),
    payment_status      VARCHAR2(20)    DEFAULT 'Unpaid',
    payment_method      VARCHAR2(50),
    transaction_id      VARCHAR2(100),
    billing_date        DATE            DEFAULT SYSDATE,
    payment_date        DATE,
    issued_by           VARCHAR2(100),
    CONSTRAINT PK_BILLING_24BCE5045
        PRIMARY KEY (billing_id),
    CONSTRAINT FK_BILLING_PATIENT_24BCE5045
        FOREIGN KEY (patient_id)
        REFERENCES PATIENT_24BCE5045(patient_id)
        ON DELETE CASCADE,
    CONSTRAINT CHK_PAY_STATUS_24BCE5045
        CHECK (payment_status IN ('Paid', 'Unpaid', 'Partial', 'Waived'))
);

-- ------------------------------------------------------------
-- TABLE 6: WELLNESS_TRACKER_24BCE5045  (Child -> PATIENT)
-- ------------------------------------------------------------
CREATE TABLE WELLNESS_TRACKER_24BCE5045 (
    tracker_id                  NUMBER          NOT NULL,
    patient_id                  NUMBER          NOT NULL,
    mood                        VARCHAR2(50),
    sleep_hours                 NUMBER(4,2),
    water_intake_liters         NUMBER(4,2),
    physical_activity_minutes   NUMBER,
    stress_level                VARCHAR2(50),
    screen_time_hours           NUMBER(4,2),
    steps_count                 NUMBER,
    calories_intake             NUMBER,
    meditation_minutes          NUMBER,
    tracker_date                DATE            DEFAULT SYSDATE,
    CONSTRAINT PK_WELLNESS_24BCE5045
        PRIMARY KEY (tracker_id),
    CONSTRAINT FK_WELLNESS_PATIENT_24BCE5045
        FOREIGN KEY (patient_id)
        REFERENCES PATIENT_24BCE5045(patient_id)
        ON DELETE CASCADE,
    CONSTRAINT CHK_MOOD_24BCE5045
        CHECK (mood IN ('Happy', 'Sad', 'Anxious', 'Calm', 'Angry', 'Neutral', 'Stressed')),
    CONSTRAINT CHK_STRESS_24BCE5045
        CHECK (stress_level IN ('Low', 'Medium', 'High', 'Very High'))
);

-- ------------------------------------------------------------
-- TABLE 7: APPOINTMENT_24BCE5045  (Child -> PATIENT)
-- ------------------------------------------------------------
CREATE TABLE APPOINTMENT_24BCE5045 (
    appointment_id      NUMBER          NOT NULL,
    patient_id          NUMBER          NOT NULL,
    doctor_name         VARCHAR2(100)   NOT NULL,
    department          VARCHAR2(50),
    appointment_date    DATE            NOT NULL,
    appointment_time    VARCHAR2(20),
    appointment_status  VARCHAR2(20)    DEFAULT 'Scheduled',
    reason_for_visit    VARCHAR2(200),
    room_number         VARCHAR2(20),
    booking_date        DATE            DEFAULT SYSDATE,
    follow_up_required  VARCHAR2(10)    DEFAULT 'No',
    remarks             VARCHAR2(200),
    CONSTRAINT PK_APPOINTMENT_24BCE5045
        PRIMARY KEY (appointment_id),
    CONSTRAINT FK_APPT_PATIENT_24BCE5045
        FOREIGN KEY (patient_id)
        REFERENCES PATIENT_24BCE5045(patient_id)
        ON DELETE CASCADE,
    CONSTRAINT CHK_APPT_STATUS_24BCE5045
        CHECK (appointment_status IN ('Scheduled', 'Completed', 'Cancelled', 'No-Show')),
    CONSTRAINT CHK_FOLLOW_UP_24BCE5045
        CHECK (follow_up_required IN ('Yes', 'No'))
);

-- ------------------------------------------------------------
-- TABLE 8: HEALTH_TIPS_24BCE5045  (Independent Table)
-- ------------------------------------------------------------
CREATE TABLE HEALTH_TIPS_24BCE5045 (
    tip_id              NUMBER          NOT NULL,
    title               VARCHAR2(100)   NOT NULL,
    description         VARCHAR2(300),
    category            VARCHAR2(50),
    target_audience     VARCHAR2(50),
    created_by          VARCHAR2(100),
    created_date        DATE            DEFAULT SYSDATE,
    last_updated        DATE            DEFAULT SYSDATE,
    importance_level    VARCHAR2(20)    DEFAULT 'Medium',
    reference_source    VARCHAR2(200),
    status              VARCHAR2(20)    DEFAULT 'Active',
    views_count         NUMBER          DEFAULT 0,
    CONSTRAINT PK_HEALTH_TIPS_24BCE5045
        PRIMARY KEY (tip_id),
    CONSTRAINT CHK_TIPS_STATUS_24BCE5045
        CHECK (status IN ('Active', 'Inactive', 'Draft')),
    CONSTRAINT CHK_IMPORTANCE_24BCE5045
        CHECK (importance_level IN ('Low', 'Medium', 'High', 'Critical'))
);

-- ============================================================
-- SECTION 5: SAMPLE INSERT STATEMENTS
-- ============================================================

-- ------------------------------------------------------------
-- INSERT: PATIENT_24BCE5045 (5 Records)
-- ------------------------------------------------------------
INSERT INTO PATIENT_24BCE5045 VALUES (
    SEQ_PATIENT_24BCE5045.NEXTVAL,
    'Arjun', 'Sharma',
    TO_DATE('2003-05-14', 'YYYY-MM-DD'),
    'Male', 'O+',
    '9876543210', 'arjun.sharma@vit.ac.in',
    '12, Gandhi Nagar, Chennai, Tamil Nadu',
    'Anita Sharma', '9876500001',
    'Computer Science', 2,
    TO_DATE('2024-07-01', 'YYYY-MM-DD')
);

INSERT INTO PATIENT_24BCE5045 VALUES (
    SEQ_PATIENT_24BCE5045.NEXTVAL,
    'Priya', 'Mehta',
    TO_DATE('2004-08-22', 'YYYY-MM-DD'),
    'Female', 'A+',
    '9123456780', 'priya.mehta@vit.ac.in',
    '45, MG Road, Vellore, Tamil Nadu',
    'Rajesh Mehta', '9123400001',
    'Biotechnology', 1,
    TO_DATE('2025-07-15', 'YYYY-MM-DD')
);

INSERT INTO PATIENT_24BCE5045 VALUES (
    SEQ_PATIENT_24BCE5045.NEXTVAL,
    'Rohan', 'Verma',
    TO_DATE('2002-11-30', 'YYYY-MM-DD'),
    'Male', 'B-',
    '9988776655', 'rohan.verma@vit.ac.in',
    '7, Anna Nagar, Chennai',
    'Sunita Verma', '9988700001',
    'Mechanical Engineering', 3,
    TO_DATE('2023-07-01', 'YYYY-MM-DD')
);

INSERT INTO PATIENT_24BCE5045 VALUES (
    SEQ_PATIENT_24BCE5045.NEXTVAL,
    'Sneha', 'Pillai',
    TO_DATE('2003-02-17', 'YYYY-MM-DD'),
    'Female', 'AB+',
    '9871234560', 'sneha.pillai@vit.ac.in',
    '22, Raja Street, Vellore',
    'Meena Pillai', '9871200001',
    'Electronics', 2,
    TO_DATE('2024-07-01', 'YYYY-MM-DD')
);

INSERT INTO PATIENT_24BCE5045 VALUES (
    SEQ_PATIENT_24BCE5045.NEXTVAL,
    'Karan', 'Nair',
    TO_DATE('2001-07-09', 'YYYY-MM-DD'),
    'Male', 'A-',
    '9765432100', 'karan.nair@vit.ac.in',
    '89, Lake View, Coimbatore',
    'Lakshmi Nair', '9765400001',
    'Civil Engineering', 4,
    TO_DATE('2022-07-01', 'YYYY-MM-DD')
);

-- ------------------------------------------------------------
-- INSERT: MEDICAL_HISTORY_24BCE5045 (5 Records)
-- ------------------------------------------------------------
INSERT INTO MEDICAL_HISTORY_24BCE5045 VALUES (
    SEQ_MEDICAL_HISTORY_24BCE5045.NEXTVAL,
    1,
    'Asthma', 'Pollen, Dust',
    'Appendectomy (2018)',
    'Inhaler - Salbutamol',
    'Father: Hypertension',
    'COVID-19, Hepatitis B, Typhoid',
    172.5, 68.0, 22.86, '120/80',
    TO_DATE('2025-01-10', 'YYYY-MM-DD')
);

INSERT INTO MEDICAL_HISTORY_24BCE5045 VALUES (
    SEQ_MEDICAL_HISTORY_24BCE5045.NEXTVAL,
    2,
    'None', 'Penicillin',
    'None',
    'Iron Supplements',
    'Mother: Diabetes',
    'COVID-19, MMR, Polio',
    158.0, 52.5, 21.04, '110/70',
    TO_DATE('2025-02-05', 'YYYY-MM-DD')
);

INSERT INTO MEDICAL_HISTORY_24BCE5045 VALUES (
    SEQ_MEDICAL_HISTORY_24BCE5045.NEXTVAL,
    3,
    'Hypertension', 'Shellfish',
    'Knee ligament repair (2021)',
    'Amlodipine 5mg',
    'Grandfather: Heart Disease',
    'COVID-19, Influenza',
    180.0, 85.0, 26.23, '140/90',
    TO_DATE('2025-01-20', 'YYYY-MM-DD')
);

INSERT INTO MEDICAL_HISTORY_24BCE5045 VALUES (
    SEQ_MEDICAL_HISTORY_24BCE5045.NEXTVAL,
    4,
    'Thyroid', 'Latex',
    'None',
    'Thyroxine 50mcg',
    'Mother: Thyroid',
    'COVID-19, Hepatitis A',
    162.0, 55.0, 20.95, '115/75',
    TO_DATE('2025-02-01', 'YYYY-MM-DD')
);

INSERT INTO MEDICAL_HISTORY_24BCE5045 VALUES (
    SEQ_MEDICAL_HISTORY_24BCE5045.NEXTVAL,
    5,
    'Diabetes Type 2', 'None',
    'Tooth extraction (2020)',
    'Metformin 500mg',
    'Father: Diabetes',
    'COVID-19, Typhoid, Hepatitis B',
    175.0, 90.0, 29.39, '130/85',
    TO_DATE('2025-01-15', 'YYYY-MM-DD')
);

-- ------------------------------------------------------------
-- INSERT: MEDICATION_24BCE5045 (5 Records)
-- ------------------------------------------------------------
INSERT INTO MEDICATION_24BCE5045 VALUES (
    SEQ_MEDICATION_24BCE5045.NEXTVAL,
    1,
    'Salbutamol Inhaler', '100mcg per puff', 'Twice daily as needed',
    180, 'Dr. Ramesh Kumar',
    TO_DATE('2025-01-10', 'YYYY-MM-DD'),
    TO_DATE('2026-01-10', 'YYYY-MM-DD'),
    'Tremors, Palpitations',
    'Shake before use, rinse mouth after',
    'Active'
);

INSERT INTO MEDICATION_24BCE5045 VALUES (
    SEQ_MEDICATION_24BCE5045.NEXTVAL,
    2,
    'Ferrous Sulfate', '200mg', 'Once daily after meal',
    90, 'Dr. Kavitha Iyer',
    TO_DATE('2025-02-05', 'YYYY-MM-DD'),
    TO_DATE('2025-05-05', 'YYYY-MM-DD'),
    'Constipation, Dark stools',
    'Take with orange juice for better absorption',
    'Active'
);

INSERT INTO MEDICATION_24BCE5045 VALUES (
    SEQ_MEDICATION_24BCE5045.NEXTVAL,
    3,
    'Amlodipine', '5mg', 'Once daily',
    365, 'Dr. Suresh Babu',
    TO_DATE('2025-01-20', 'YYYY-MM-DD'),
    TO_DATE('2026-01-20', 'YYYY-MM-DD'),
    'Swollen ankles, Flushing',
    'Take at same time each day',
    'Active'
);

INSERT INTO MEDICATION_24BCE5045 VALUES (
    SEQ_MEDICATION_24BCE5045.NEXTVAL,
    4,
    'Levothyroxine', '50mcg', 'Once daily before breakfast',
    365, 'Dr. Preethi Nair',
    TO_DATE('2025-02-01', 'YYYY-MM-DD'),
    TO_DATE('2026-02-01', 'YYYY-MM-DD'),
    'Palpitations if overdosed',
    'Take on empty stomach, 30 mins before food',
    'Active'
);

INSERT INTO MEDICATION_24BCE5045 VALUES (
    SEQ_MEDICATION_24BCE5045.NEXTVAL,
    5,
    'Metformin', '500mg', 'Twice daily with meals',
    365, 'Dr. Anand Pillai',
    TO_DATE('2025-01-15', 'YYYY-MM-DD'),
    TO_DATE('2026-01-15', 'YYYY-MM-DD'),
    'Nausea, Diarrhea initially',
    'Take with meals to reduce side effects',
    'Active'
);

-- ------------------------------------------------------------
-- INSERT: DIAGNOSTIC_TEST_RESULT_24BCE5045 (5 Records)
-- ------------------------------------------------------------
INSERT INTO DIAGNOSTIC_TEST_RESULT_24BCE5045 VALUES (
    SEQ_DIAGNOSTIC_TEST_24BCE5045.NEXTVAL,
    1,
    'Complete Blood Count', 'Blood Test',
    'WBC: 7200, RBC: 4.8M, Hb: 14.5 g/dL',
    'WBC: 4000-11000, RBC: 4.5-6M, Hb: 13-17',
    TO_DATE('2025-01-08', 'YYYY-MM-DD'),
    'VIT Health Center Lab', 'Techician Ramya S',
    'Normal CBC; Asthma unrelated', 'Monitor quarterly',
    'Reviewed'
);

INSERT INTO DIAGNOSTIC_TEST_RESULT_24BCE5045 VALUES (
    SEQ_DIAGNOSTIC_TEST_24BCE5045.NEXTVAL,
    2,
    'Serum Iron Test', 'Blood Test',
    'Serum Iron: 45 mcg/dL, Ferritin: 8 ng/mL',
    'Serum Iron: 60-170 mcg/dL, Ferritin: 12-150',
    TO_DATE('2025-02-03', 'YYYY-MM-DD'),
    'SRL Diagnostics', 'Technician Priyanka M',
    'Iron deficiency confirmed, start supplements', 'Follow up in 3 months',
    'Reviewed'
);

INSERT INTO DIAGNOSTIC_TEST_RESULT_24BCE5045 VALUES (
    SEQ_DIAGNOSTIC_TEST_24BCE5045.NEXTVAL,
    3,
    'Blood Pressure Monitoring', 'Cardiovascular',
    '145/92 mmHg - Stage 1 Hypertension',
    '120/80 mmHg or below',
    TO_DATE('2025-01-18', 'YYYY-MM-DD'),
    'VIT Health Center', 'Nurse Kavitha R',
    'Continue medication, reduce salt intake', 'Lifestyle changes advised',
    'Reviewed'
);

INSERT INTO DIAGNOSTIC_TEST_RESULT_24BCE5045 VALUES (
    SEQ_DIAGNOSTIC_TEST_24BCE5045.NEXTVAL,
    4,
    'Thyroid Function Test (TSH)', 'Hormonal',
    'TSH: 6.8 mIU/L - Hypothyroid',
    'TSH: 0.4 - 4.0 mIU/L',
    TO_DATE('2025-01-30', 'YYYY-MM-DD'),
    'Thyrocare', 'Technician Arun V',
    'Elevated TSH; continue Levothyroxine', 'Retest in 6 weeks',
    'Reviewed'
);

INSERT INTO DIAGNOSTIC_TEST_RESULT_24BCE5045 VALUES (
    SEQ_DIAGNOSTIC_TEST_24BCE5045.NEXTVAL,
    5,
    'Fasting Blood Sugar', 'Blood Test',
    'Fasting glucose: 182 mg/dL',
    'Fasting: 70-100 mg/dL',
    TO_DATE('2025-01-13', 'YYYY-MM-DD'),
    'Lal Path Labs', 'Technician Deepa K',
    'Uncontrolled diabetes; increase Metformin', 'Diet overhaul advised',
    'Reviewed'
);

-- ------------------------------------------------------------
-- INSERT: BILLING_24BCE5045 (5 Records)
-- ------------------------------------------------------------
INSERT INTO BILLING_24BCE5045 VALUES (
    SEQ_BILLING_24BCE5045.NEXTVAL,
    1,
    300, 500, 150, 950,
    'Paid', 'UPI', 'TXN20250108001',
    TO_DATE('2025-01-08', 'YYYY-MM-DD'),
    TO_DATE('2025-01-08', 'YYYY-MM-DD'),
    'Dr. Ramesh Kumar'
);

INSERT INTO BILLING_24BCE5045 VALUES (
    SEQ_BILLING_24BCE5045.NEXTVAL,
    2,
    200, 800, 200, 1200,
    'Paid', 'Net Banking', 'TXN20250204001',
    TO_DATE('2025-02-04', 'YYYY-MM-DD'),
    TO_DATE('2025-02-04', 'YYYY-MM-DD'),
    'Dr. Kavitha Iyer'
);

INSERT INTO BILLING_24BCE5045 VALUES (
    SEQ_BILLING_24BCE5045.NEXTVAL,
    3,
    400, 300, 250, 950,
    'Unpaid', NULL, NULL,
    TO_DATE('2025-01-19', 'YYYY-MM-DD'),
    NULL,
    'Dr. Suresh Babu'
);

INSERT INTO BILLING_24BCE5045 VALUES (
    SEQ_BILLING_24BCE5045.NEXTVAL,
    4,
    350, 600, 180, 1130,
    'Partial', 'Cash', 'CASH20250131001',
    TO_DATE('2025-01-31', 'YYYY-MM-DD'),
    TO_DATE('2025-01-31', 'YYYY-MM-DD'),
    'Dr. Preethi Nair'
);

INSERT INTO BILLING_24BCE5045 VALUES (
    SEQ_BILLING_24BCE5045.NEXTVAL,
    5,
    500, 400, 300, 1200,
    'Waived', 'Scholarship Fund', 'WAIV20250114001',
    TO_DATE('2025-01-14', 'YYYY-MM-DD'),
    TO_DATE('2025-01-14', 'YYYY-MM-DD'),
    'Dr. Anand Pillai'
);

-- ------------------------------------------------------------
-- INSERT: WELLNESS_TRACKER_24BCE5045 (5 Records)
-- ------------------------------------------------------------
INSERT INTO WELLNESS_TRACKER_24BCE5045 VALUES (
    SEQ_WELLNESS_TRACKER_24BCE5045.NEXTVAL,
    1, 'Calm', 7.5, 2.5, 45, 'Low', 4.0, 8500, 1800, 15,
    TO_DATE('2025-02-10', 'YYYY-MM-DD')
);

INSERT INTO WELLNESS_TRACKER_24BCE5045 VALUES (
    SEQ_WELLNESS_TRACKER_24BCE5045.NEXTVAL,
    2, 'Anxious', 6.0, 1.5, 20, 'High', 7.0, 5000, 2100, 0,
    TO_DATE('2025-02-10', 'YYYY-MM-DD')
);

INSERT INTO WELLNESS_TRACKER_24BCE5045 VALUES (
    SEQ_WELLNESS_TRACKER_24BCE5045.NEXTVAL,
    3, 'Stressed', 5.0, 3.0, 60, 'Very High', 8.0, 3000, 2500, 0,
    TO_DATE('2025-02-10', 'YYYY-MM-DD')
);

INSERT INTO WELLNESS_TRACKER_24BCE5045 VALUES (
    SEQ_WELLNESS_TRACKER_24BCE5045.NEXTVAL,
    4, 'Happy', 8.0, 2.0, 30, 'Low', 3.0, 7500, 1700, 20,
    TO_DATE('2025-02-10', 'YYYY-MM-DD')
);

INSERT INTO WELLNESS_TRACKER_24BCE5045 VALUES (
    SEQ_WELLNESS_TRACKER_24BCE5045.NEXTVAL,
    5, 'Neutral', 6.5, 2.0, 25, 'Medium', 5.0, 6000, 2200, 10,
    TO_DATE('2025-02-10', 'YYYY-MM-DD')
);

-- ------------------------------------------------------------
-- INSERT: APPOINTMENT_24BCE5045 (5 Records)
-- ------------------------------------------------------------
INSERT INTO APPOINTMENT_24BCE5045 VALUES (
    SEQ_APPOINTMENT_24BCE5045.NEXTVAL,
    1, 'Dr. Ramesh Kumar', 'Pulmonology',
    TO_DATE('2025-03-05', 'YYYY-MM-DD'), '10:00 AM',
    'Scheduled', 'Asthma follow-up check',
    'Room 12-B',
    TO_DATE('2025-02-20', 'YYYY-MM-DD'),
    'Yes', 'Continue inhaler, spirometry advised'
);

INSERT INTO APPOINTMENT_24BCE5045 VALUES (
    SEQ_APPOINTMENT_24BCE5045.NEXTVAL,
    2, 'Dr. Kavitha Iyer', 'General Medicine',
    TO_DATE('2025-03-10', 'YYYY-MM-DD'), '11:30 AM',
    'Scheduled', 'Iron deficiency follow-up',
    'Room 5-A',
    TO_DATE('2025-02-22', 'YYYY-MM-DD'),
    'No', 'Check hemoglobin levels'
);

INSERT INTO APPOINTMENT_24BCE5045 VALUES (
    SEQ_APPOINTMENT_24BCE5045.NEXTVAL,
    3, 'Dr. Suresh Babu', 'Cardiology',
    TO_DATE('2025-02-28', 'YYYY-MM-DD'), '09:00 AM',
    'Completed', 'Blood pressure review',
    'OPD-3',
    TO_DATE('2025-02-15', 'YYYY-MM-DD'),
    'Yes', 'BP stabilized, lifestyle changes required'
);

INSERT INTO APPOINTMENT_24BCE5045 VALUES (
    SEQ_APPOINTMENT_24BCE5045.NEXTVAL,
    4, 'Dr. Preethi Nair', 'Endocrinology',
    TO_DATE('2025-03-12', 'YYYY-MM-DD'), '02:00 PM',
    'Scheduled', 'Thyroid re-evaluation',
    'Room 8-C',
    TO_DATE('2025-02-18', 'YYYY-MM-DD'),
    'Yes', 'TSH retest results pending'
);

INSERT INTO APPOINTMENT_24BCE5045 VALUES (
    SEQ_APPOINTMENT_24BCE5045.NEXTVAL,
    5, 'Dr. Anand Pillai', 'Diabetology',
    TO_DATE('2025-03-01', 'YYYY-MM-DD'), '03:30 PM',
    'Cancelled', 'Diabetes management session',
    'Room 6-D',
    TO_DATE('2025-02-10', 'YYYY-MM-DD'),
    'No', 'Patient cancelled due to exams'
);

-- ------------------------------------------------------------
-- INSERT: HEALTH_TIPS_24BCE5045 (8 Records)
-- ------------------------------------------------------------
INSERT INTO HEALTH_TIPS_24BCE5045 VALUES (
    SEQ_HEALTH_TIPS_24BCE5045.NEXTVAL,
    'Stay Hydrated During Exams',
    'Drink at least 8-10 glasses of water daily. Dehydration reduces concentration and increases fatigue during exam periods.',
    'Hydration', 'Students',
    'Campus Health Team',
    TO_DATE('2025-01-01', 'YYYY-MM-DD'),
    TO_DATE('2025-01-01', 'YYYY-MM-DD'),
    'High', 'WHO Hydration Guidelines 2023',
    'Active', 0
);

INSERT INTO HEALTH_TIPS_24BCE5045 VALUES (
    SEQ_HEALTH_TIPS_24BCE5045.NEXTVAL,
    'Maintain a Consistent Sleep Schedule',
    'Aim for 7-9 hours of sleep nightly. Poor sleep affects memory retention, immune function, and emotional regulation.',
    'Sleep Health', 'All',
    'Dr. Preethi Nair',
    TO_DATE('2025-01-05', 'YYYY-MM-DD'),
    TO_DATE('2025-01-05', 'YYYY-MM-DD'),
    'Critical', 'National Sleep Foundation',
    'Active', 0
);

INSERT INTO HEALTH_TIPS_24BCE5045 VALUES (
    SEQ_HEALTH_TIPS_24BCE5045.NEXTVAL,
    'Practice 20-20-20 Rule for Eye Health',
    'Every 20 minutes, look at something 20 feet away for 20 seconds. Reduces digital eye strain from prolonged screen use.',
    'Eye Care', 'Students',
    'Dr. Arun Menon',
    TO_DATE('2025-01-10', 'YYYY-MM-DD'),
    TO_DATE('2025-01-10', 'YYYY-MM-DD'),
    'Medium', 'American Optometric Association',
    'Active', 0
);

INSERT INTO HEALTH_TIPS_24BCE5045 VALUES (
    SEQ_HEALTH_TIPS_24BCE5045.NEXTVAL,
    'Eat a Balanced Diet Rich in Nutrients',
    'Include fruits, vegetables, whole grains, and proteins. Avoid overreliance on processed food and energy drinks during study sessions.',
    'Nutrition', 'Students',
    'Campus Dietitian',
    TO_DATE('2025-01-15', 'YYYY-MM-DD'),
    TO_DATE('2025-01-15', 'YYYY-MM-DD'),
    'High', 'Harvard T.H. Chan School of Public Health',
    'Active', 0
);

INSERT INTO HEALTH_TIPS_24BCE5045 VALUES (
    SEQ_HEALTH_TIPS_24BCE5045.NEXTVAL,
    'Manage Exam Stress with Mindfulness',
    'Practice deep breathing, meditation, or yoga for at least 10 minutes daily. These techniques lower cortisol and improve focus.',
    'Mental Health', 'Students',
    'Dr. Sunita Rajan',
    TO_DATE('2025-01-20', 'YYYY-MM-DD'),
    TO_DATE('2025-01-20', 'YYYY-MM-DD'),
    'Critical', 'American Psychological Association',
    'Active', 0
);

INSERT INTO HEALTH_TIPS_24BCE5045 VALUES (
    SEQ_HEALTH_TIPS_24BCE5045.NEXTVAL,
    'Walk at Least 30 Minutes Every Day',
    'Regular physical activity boosts brain function, reduces depression, and improves cardiovascular health. Even a brisk walk counts!',
    'Physical Activity', 'All',
    'Campus Fitness Trainer',
    TO_DATE('2025-01-25', 'YYYY-MM-DD'),
    TO_DATE('2025-01-25', 'YYYY-MM-DD'),
    'High', 'WHO Physical Activity Guidelines 2020',
    'Active', 0
);

INSERT INTO HEALTH_TIPS_24BCE5045 VALUES (
    SEQ_HEALTH_TIPS_24BCE5045.NEXTVAL,
    'Wash Hands Frequently to Prevent Infections',
    'Wash hands with soap for at least 20 seconds before meals, after washroom use, and after touching shared surfaces.',
    'Hygiene', 'All',
    'Campus Health Team',
    TO_DATE('2025-02-01', 'YYYY-MM-DD'),
    TO_DATE('2025-02-01', 'YYYY-MM-DD'),
    'Critical', 'CDC Hand Hygiene Guidelines',
    'Active', 0
);

INSERT INTO HEALTH_TIPS_24BCE5045 VALUES (
    SEQ_HEALTH_TIPS_24BCE5045.NEXTVAL,
    'Limit Caffeine Intake After 3 PM',
    'Excessive caffeine disrupts sleep cycles. Limit coffee or energy drinks especially in the afternoon to protect sleep quality.',
    'Sleep Health', 'Students',
    'Dr. Ramesh Kumar',
    TO_DATE('2025-02-10', 'YYYY-MM-DD'),
    TO_DATE('2025-02-10', 'YYYY-MM-DD'),
    'Medium', 'Sleep Research Society Journal',
    'Active', 0
);

-- ============================================================
-- SECTION 6: COMMIT TRANSACTION
-- ============================================================
COMMIT;

-- ============================================================
-- SECTION 7: VERIFICATION QUERIES
-- ============================================================

-- Count rows in each table
SELECT 'PATIENT_24BCE5045'               AS TABLE_NAME, COUNT(*) AS TOTAL_ROWS FROM PATIENT_24BCE5045
UNION ALL
SELECT 'MEDICAL_HISTORY_24BCE5045',      COUNT(*) FROM MEDICAL_HISTORY_24BCE5045
UNION ALL
SELECT 'MEDICATION_24BCE5045',           COUNT(*) FROM MEDICATION_24BCE5045
UNION ALL
SELECT 'DIAGNOSTIC_TEST_RESULT_24BCE5045', COUNT(*) FROM DIAGNOSTIC_TEST_RESULT_24BCE5045
UNION ALL
SELECT 'BILLING_24BCE5045',              COUNT(*) FROM BILLING_24BCE5045
UNION ALL
SELECT 'WELLNESS_TRACKER_24BCE5045',     COUNT(*) FROM WELLNESS_TRACKER_24BCE5045
UNION ALL
SELECT 'APPOINTMENT_24BCE5045',          COUNT(*) FROM APPOINTMENT_24BCE5045
UNION ALL
SELECT 'HEALTH_TIPS_24BCE5045',          COUNT(*) FROM HEALTH_TIPS_24BCE5045;

-- View Patient with their Appointments
SELECT
    p.patient_id,
    p.first_name || ' ' || p.last_name   AS patient_name,
    p.department,
    a.doctor_name,
    a.appointment_date,
    a.appointment_status
FROM
    PATIENT_24BCE5045 p
    JOIN APPOINTMENT_24BCE5045 a ON p.patient_id = a.patient_id
ORDER BY
    a.appointment_date;

-- View Patient Billing Summary
SELECT
    p.first_name || ' ' || p.last_name  AS patient_name,
    b.total_amount,
    b.payment_status,
    b.payment_method,
    b.billing_date
FROM
    PATIENT_24BCE5045 p
    JOIN BILLING_24BCE5045 b ON p.patient_id = b.patient_id;

-- ============================================================
-- END OF SCRIPT
-- ============================================================
