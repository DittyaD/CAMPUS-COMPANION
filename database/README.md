# Campus Health and Wellness Companion
## Database & Backend Setup Guide — 24BCE5045

---

## 📁 Project Structure

```
CAMPUS COMPANION/
├── frontend/               ← React.js Frontend (DO NOT MODIFY)
├── backend/
│   ├── app.py              ← Flask REST API
│   └── requirements.txt    ← Python dependencies
└── database/
    └── campus_health_db.sql ← Oracle 11g SQL Script
```

---

## 🗄️ Database Setup (Oracle 11g / SQL*Plus)

### Step 1 — Open SQL*Plus
```
sqlplus your_username/your_password@XE
```

### Step 2 — Run the SQL Script
```sql
@path\to\database\campus_health_db.sql
```
> Example: `@D:\VIT\SEMESTER 4\DBMS\CAMPUS COMPANION\database\campus_health_db.sql`

---

## 📊 Tables Created

| # | Table Name                          | Description          |  Rows |
|---|-------------------------------------|----------------------|-------|
| 1 | `PATIENT_24BCE5045`                 | Master patient table |  5    |
| 2 | `MEDICAL_HISTORY_24BCE5045`         | Medical records      |  5    |
| 3 | `MEDICATION_24BCE5045`              | Prescriptions        |  5    |
| 4 | `DIAGNOSTIC_TEST_RESULT_24BCE5045`  | Lab test results     |  5    |
| 5 | `BILLING_24BCE5045`                 | Fees and payments    |  5    |
| 6 | `WELLNESS_TRACKER_24BCE5045`        | Daily wellness logs  |  5    |
| 7 | `APPOINTMENT_24BCE5045`             | Doctor appointments  |  5    |
| 8 | `HEALTH_TIPS_24BCE5045`             | Independent tips     |  8    |

---

## 🔗 Relationships

```
PATIENT_24BCE5045  (PK: patient_id)
    ├──< MEDICAL_HISTORY_24BCE5045    (FK: patient_id)  [One-to-Many]
    ├──< MEDICATION_24BCE5045          (FK: patient_id)  [One-to-Many]
    ├──< DIAGNOSTIC_TEST_RESULT_24BCE5045 (FK: patient_id) [One-to-Many]
    ├──< BILLING_24BCE5045             (FK: patient_id)  [One-to-Many]
    ├──< WELLNESS_TRACKER_24BCE5045    (FK: patient_id)  [One-to-Many]
    └──< APPOINTMENT_24BCE5045         (FK: patient_id)  [One-to-Many]

HEALTH_TIPS_24BCE5045  ← Independent Table (No FK)
```

---

## ⚙️ Flask Backend Setup

### Step 1 — Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 2 — Configure Oracle Credentials
Open `backend/app.py` and update:
```python
DB_USER     = "your_oracle_username"
DB_PASSWORD = "your_oracle_password"
DB_DSN      = "localhost:1521/XE"
```

### Step 3 — Run the Backend
```bash
python app.py
```
Backend runs at: `http://localhost:5000`

---

## 🌐 API Endpoints

| Method | Endpoint                                  | Description                  |
|--------|-------------------------------------------|------------------------------|
| GET    | `/`                                       | Health check                 |
| GET    | `/api/dashboard/stats`                    | Dashboard aggregate counts   |
| GET    | `/api/patients`                           | All patients                 |
| GET    | `/api/patients/<id>`                      | Patient by ID                |
| POST   | `/api/patients`                           | Add new patient              |
| PUT    | `/api/patients/<id>`                      | Update patient               |
| DELETE | `/api/patients/<id>`                      | Delete patient               |
| GET    | `/api/medical-history/patient/<id>`       | Medical history by patient   |
| POST   | `/api/medical-history`                    | Add medical history          |
| GET    | `/api/medications/patient/<id>`           | Medications by patient       |
| POST   | `/api/medications`                        | Add medication               |
| GET    | `/api/diagnostic-tests/patient/<id>`      | Test results by patient      |
| POST   | `/api/diagnostic-tests`                   | Add test result              |
| GET    | `/api/billing/patient/<id>`               | Bills by patient             |
| POST   | `/api/billing`                            | Add billing record           |
| GET    | `/api/wellness/patient/<id>`              | Wellness logs by patient     |
| POST   | `/api/wellness`                           | Log wellness entry           |
| GET    | `/api/appointments`                       | All appointments             |
| GET    | `/api/appointments/patient/<id>`          | Appointments by patient      |
| POST   | `/api/appointments`                       | Book appointment             |
| PUT    | `/api/appointments/<id>`                  | Update appointment status    |
| GET    | `/api/health-tips`                        | All active tips              |
| GET    | `/api/health-tips?category=Nutrition`     | Tips filtered by category    |
| GET    | `/api/health-tips/<id>`                   | Single tip (increments view) |
| POST   | `/api/health-tips`                        | Add health tip               |

---

## 🔢 Sequences Created

| Sequence Name                      | For Table                          |
|------------------------------------|------------------------------------|
| `SEQ_PATIENT_24BCE5045`            | PATIENT_24BCE5045                  |
| `SEQ_MEDICAL_HISTORY_24BCE5045`    | MEDICAL_HISTORY_24BCE5045          |
| `SEQ_MEDICATION_24BCE5045`         | MEDICATION_24BCE5045               |
| `SEQ_DIAGNOSTIC_TEST_24BCE5045`    | DIAGNOSTIC_TEST_RESULT_24BCE5045   |
| `SEQ_BILLING_24BCE5045`            | BILLING_24BCE5045                  |
| `SEQ_WELLNESS_TRACKER_24BCE5045`   | WELLNESS_TRACKER_24BCE5045         |
| `SEQ_APPOINTMENT_24BCE5045`        | APPOINTMENT_24BCE5045              |
| `SEQ_HEALTH_TIPS_24BCE5045`        | HEALTH_TIPS_24BCE5045              |

---

## ✅ Verification Query (Run in SQL*Plus)

```sql
SELECT 'PATIENT_24BCE5045'               AS TABLE_NAME, COUNT(*) AS ROWS FROM PATIENT_24BCE5045
UNION ALL SELECT 'MEDICAL_HISTORY_24BCE5045',  COUNT(*) FROM MEDICAL_HISTORY_24BCE5045
UNION ALL SELECT 'MEDICATION_24BCE5045',        COUNT(*) FROM MEDICATION_24BCE5045
UNION ALL SELECT 'DIAGNOSTIC_TEST_RESULT_24BCE5045', COUNT(*) FROM DIAGNOSTIC_TEST_RESULT_24BCE5045
UNION ALL SELECT 'BILLING_24BCE5045',           COUNT(*) FROM BILLING_24BCE5045
UNION ALL SELECT 'WELLNESS_TRACKER_24BCE5045',  COUNT(*) FROM WELLNESS_TRACKER_24BCE5045
UNION ALL SELECT 'APPOINTMENT_24BCE5045',       COUNT(*) FROM APPOINTMENT_24BCE5045
UNION ALL SELECT 'HEALTH_TIPS_24BCE5045',       COUNT(*) FROM HEALTH_TIPS_24BCE5045;
```
