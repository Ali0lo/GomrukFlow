#!/usr/bin/env bash

# GömrükFlow Startup Script
# Starts FastAPI backend (port 8000) and Next.js frontend (port 3000)

echo "=========================================================="
echo "    GömrükFlow — Smart Customs AI Copilot for Agri-Exports"
echo "=========================================================="

# Check Python virtual environment
if [ ! -d "backend/venv" ]; then
    echo "Creating backend virtual environment..."
    python3 -m venv backend/venv
    ./backend/venv/bin/pip install fastapi uvicorn pydantic python-multipart httpx
fi

# Start FastAPI Backend
echo "Starting Backend API on http://127.0.0.1:8000..."
./backend/venv/bin/python -m uvicorn main:app --app-dir backend --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

# Start Next.js Frontend
echo "Starting Frontend UI on http://127.0.0.1:3001..."
cd frontend && npm run dev &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM

echo ""
echo "🚀 GömrükFlow is live!"
echo "👉 Frontend: http://localhost:3001"
echo "👉 API Docs: http://localhost:8000/docs"
echo "Press Ctrl+C to stop both servers."
echo ""

wait
