Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   FIRESIGHT AI - LOCAL PRODUCTION LIVE RUNNER" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan

$scriptDir = $PSScriptRoot
if (-not $scriptDir) { $scriptDir = (Get-Location).Path }

# Check dependencies
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not found in PATH." -ForegroundColor Red
    Pause
    exit 1
}

# 1. Start Python AI Service
Write-Host "[1/3] Starting Python Fast AI Inference Engine on port 8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptDir\ai-service'; Write-Host '--- FIRESIGHT AI ENGINE (PORT 8000) ---' -ForegroundColor Magenta; python -m uvicorn app.main:app --port 8000 --reload"

Start-Sleep -Seconds 2

# 2. Start Backend
Write-Host "[2/3] Starting Geospatial Node.js Backend on port 5000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptDir\backend'; Write-Host '--- FIRESIGHT BACKEND (PORT 5000) ---' -ForegroundColor Cyan; node src/server.js"

Start-Sleep -Seconds 2

# 3. Start Frontend
Write-Host "[3/3] Starting React Vite Command Center on port 5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptDir\frontend'; Write-Host '--- FIRESIGHT FRONTEND (PORT 5173) ---' -ForegroundColor Green; npm run dev"

Start-Sleep -Seconds 3

# Open default browser
Write-Host "`n[SUCCESS] Launching your browser to http://localhost:5173 ..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host "All 3 services are running in their respective windows. Keep them open while testing." -ForegroundColor Gray
