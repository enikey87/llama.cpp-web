#!/bin/bash

# llama.cpp-web Server Runner
# Usage: ./run_server.sh

echo "🚀 Starting llama.cpp-web server..."

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: python3 is not installed or not in PATH"
    exit 1
fi

# Check if requirements are installed
if ! python3 -c "import fastapi, uvicorn, pydantic, yaml" 2>/dev/null; then
    echo "📦 Installing dependencies..."
    pip3 install -r requirements.txt
fi

# Check if config file exists
if [ ! -f "config/models.yaml" ]; then
    echo "❌ Error: config/models.yaml not found"
    exit 1
fi

# Check if llama-cli is available
if ! command -v llama-cli &> /dev/null; then
    echo "⚠️  Warning: llama-cli not found in PATH"
    echo "   Make sure llama.cpp is installed and llama-cli is accessible"
fi

echo "🌐 Server will be available at: http://localhost:11434"
echo "📚 API Documentation: http://localhost:11434/docs"
echo "🔍 Health Check: http://localhost:11434/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
python3 -m uvicorn src.server:app --host 0.0.0.0 --port 11434 --reload 