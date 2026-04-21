import oracledb

conn = oracledb.connect(user='system', password='12345', dsn='localhost:1521/XE')
cur = conn.cursor()

# Add password_hash column if it doesn't exist
try:
    cur.execute("ALTER TABLE PATIENT_24BCE5045 ADD (password_hash VARCHAR2(64))")
    print("password_hash column added.")
except Exception as e:
    if "ORA-01430" in str(e):  # column already exists
        print("password_hash column already exists, skipping.")
    else:
        print("Column error:", e)

conn.commit()
cur.close()
conn.close()
print("Done.")
