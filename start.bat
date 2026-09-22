@echo off
title FireSight AI Launcher
color 0A
echo ======================================================================
echo           FIRESIGHT AI - MULTI-TIER PLATFORM LAUNCHER
echo ======================================================================
echo.

cd /d "%~dp0"

echo [1/3] Starting Python Fast AI Inference Engine on port 8000...
start "FireSight AI Service (FastAPI :8000)" cmd /k "cd ai-service && python -m uvicorn app.main:app --port 8000 --reload"

timeout /t 2 /nobreak >nul

echo [2/3] Starting Node.js Geospatial Backend on port 5000...
start "FireSight Backend (Node.js :5000)" cmd /k "cd backend && npm run dev"

timeout /t 2 /nobreak >nul

echo [3/3] Starting React Vite Frontend Command Center on port 5173...
start "FireSight Frontend (React :5173)" cmd /k "cd frontend && npm run dev"

echo.
echo ======================================================================
echo All 3 FireSight AI microservices have been launched in dedicated windows!
echo - Frontend:  http://localhost:5173
echo - Backend:   http://localhost:5000/api/monitoring/status
echo - AI Engine: http://localhost:8000/docs
echo ======================================================================
echo You can keep this window open or close it. The microservice windows will stay running!
pause
