@echo off
REM Frontend Run Script - Use this to start the frontend dev server

echo.
echo ╔═══════════════════════════════════════════╗
echo ║  Starting SyncForge Frontend Server      ║
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

echo Starting Vite development server...
echo.
echo 🎨 Frontend will open on: http://localhost:5173
echo ⚡ Hot Module Replacement: Enabled
echo.
echo Waiting for compilation...
echo.

npm run dev
