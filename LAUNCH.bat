@echo off
title FireSight AI One-Click System
color 0B
echo ===================================================================
echo             FIRESIGHT AI - LIVE DASHBOARD LAUNCHER
echo ===================================================================
echo.
cd /d "%~dp0"

echo [1/2] Starting Node.js + MongoDB Atlas Backend on port 5000...
start "FireSight Backend (:5000)" cmd /k "cd backend && node src/server.js"

timeout /t 3 /nobreak >nul

echo [2/2] Starting React Command Center on port 5173...
start "FireSight Frontend (:5173)" cmd /k "cd frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo [3/3] Launching your web browser to http://localhost:5173 ...
start http://localhost:5173

echo.
echo ===================================================================
echo Both services are now running in their own command prompt windows!
echo Keep those two windows open to use the app.
echo ===================================================================
pause
