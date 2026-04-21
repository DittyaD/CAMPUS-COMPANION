@echo off
title Campus Companion - Flask Backend
echo ============================================
echo   CAMPUS COMPANION - FLASK BACKEND
echo ============================================
echo.
cd /d "d:\VIT\SEMESTER 4\DBMS\CAMPUS COMPANION\backend"
echo [1/2] Installing Python dependencies...
pip install flask flask-cors oracledb
echo.
echo [2/2] Starting Flask server on http://localhost:5000 ...
echo.
python app.py
pause
