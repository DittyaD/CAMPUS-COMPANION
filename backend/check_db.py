import oracledb

print("Connecting to Oracle...")
try:
    conn = oracledb.connect(user="system", password="12345", dsn="localhost:1521/XE")
    print("CONNECTION SUCCESSFUL!")

    cur = conn.cursor()
    cur.execute("SELECT table_name FROM all_tables WHERE table_name LIKE '%24BCE5045%' ORDER BY table_name")
    tables = cur.fetchall()

    if tables:
        print("\nFound " + str(len(tables)) + " project tables:")
        for t in tables:
            print("  -> " + t[0])
    else:
        print("\nNO PROJECT TABLES FOUND!")
        print("   You need to run the SQL script in Oracle SQL Developer first.")
        print("   File: database/campus_health_db.sql")

    cur.close()
    conn.close()

except Exception as e:
    print("CONNECTION FAILED!")
    print("Error: " + str(e))
