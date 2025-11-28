#!/bin/bash
# Frontend Run Script - Use this to start the frontend dev server

echo ""
echo "╔═══════════════════════════════════════════╗"
echo "║  Starting SyncForge Frontend Server      ║"
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

echo "Starting Vite development server..."
echo ""
echo "🎨 Frontend will open on: http://localhost:5173"
echo "⚡ Hot Module Replacement: Enabled"
echo ""
echo "Waiting for compilation..."
echo ""

npm run dev
