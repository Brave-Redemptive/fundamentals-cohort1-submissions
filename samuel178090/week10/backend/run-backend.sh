#!/bin/bash
# Backend Run Script - Use this to start the backend server

echo ""
echo "╔═══════════════════════════════════════════╗"
echo "║  Starting SyncForge Backend Server       ║"
echo "║  Press Ctrl+C to stop                    ║"
echo "╚═══════════════════════════════════════════╝"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  Dependencies not installed"
    echo "Installing now..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Installation failed"
        exit 1
    fi
fi

echo "Starting development server..."
echo ""
echo "🚀 Backend running on: http://localhost:5000"
echo "🏥 Health check: http://localhost:5000/health"
echo ""
echo "Wait for message: '[INFO] SyncForge API Server running...'"
echo ""

npm run dev
