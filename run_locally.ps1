Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   FIRESIGHT AI - LOCAL PRODUCTION LIVE RUNNER" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan

# Check if node is available
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not found in PATH." -ForegroundColor Red
    Pause
    exit 1
}

# Start backend
Write-Host "[1/2] Starting Geospatial Node.js Backend on port 5000..." -ForegroundColor Yellow
 = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '\backend'; Write-Host '--- FIRESIGHT BACKEND (PORT 5000) ---' -ForegroundColor Cyan; node src/server.js" -PassThru

# Start frontend
Write-Host "[2/2] Starting React Vite Command Center on port 5173..." -ForegroundColor Yellow
 = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '\frontend'; Write-Host '--- FIRESIGHT FRONTEND (PORT 5173) ---' -ForegroundColor Green; npm run dev" -PassThru

Write-Host "
Waiting 3 seconds for services to initialize..." -ForegroundColor DarkGray
Start-Sleep -Seconds 3

# Open default browser
Write-Host "
[SUCCESS] Launching your browser to http://localhost:5173 ..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host "Keep this window or close it. The service terminals will stay open." -ForegroundColor Gray
