@echo off
REM Backend Run Script - Use this to start the backend server

echo.
echo ╔═══════════════════════════════════════════╗
echo ║  Starting SyncForge Backend Server       ║
echo ║  Press Ctrl+C to stop                    ║
echo ╚═══════════════════════════════════════════╝
echo.

REM Check if node_modules exists
if not exist node_modules (
    echo ⚠️  Dependencies not installed
    echo Installing now...
    call npm install
    if errorlevel 1 (
        echo ❌ Installation failed
        pause
        exit /b 1
    )
)

echo Starting development server...
echo.
echo 🚀 Backend running on: http://localhost:5000
echo 🏥 Health check: http://localhost:5000/health
echo.
echo Wait for message: "[INFO] SyncForge API Server running..."
echo.

npm run dev
