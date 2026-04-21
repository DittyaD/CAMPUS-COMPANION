import oracledb

conn = oracledb.connect(user='system', password='12345', dsn='localhost:1521/XE')
cur = conn.cursor()

try:
    cur.execute("DROP TRIGGER TRG_NO_SHOW_PENALTY_24BCE5045")
    print("Trigger dropped.")
except Exception as e:
    print("Trigger drop:", e)

try:
    cur.execute("DROP VIEW DOCTOR_CLINICAL_VIEW_24BCE5045")
    print("View dropped.")
except Exception as e:
    print("View drop:", e)

conn.commit()
cur.close()
conn.close()
print("Done.")
