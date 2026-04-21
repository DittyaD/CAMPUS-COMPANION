@echo off
echo ============================================
echo   CAMPUS COMPANION - STARTING ALL SERVERS
echo ============================================
echo.
echo Starting Backend (Flask) in a new window...
start "Flask Backend" cmd /k "cd /d "d:\VIT\SEMESTER 4\DBMS\CAMPUS COMPANION\backend" && pip install flask flask-cors oracledb && python app.py"

echo Waiting 5 seconds before starting frontend...
timeout /t 5 /nobreak > nul

echo Starting Frontend (React) in a new window...
start "React Frontend" cmd /k "cd /d "d:\VIT\SEMESTER 4\DBMS\CAMPUS COMPANION\frontend" && set HOST=0.0.0.0 && npm start"

echo.
echo Both servers are starting in separate windows!
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
echo.
echo The browser will open automatically when React is ready.
pause
