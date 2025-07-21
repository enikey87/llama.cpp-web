# llama.cpp-web

A web interface for llama.cpp with Ollama-compatible REST API, featuring a React chat UI and Python FastAPI backend.

## What is it?

- **Backend**: Python FastAPI server that wraps llama.cpp CLI commands
- **Frontend**: React TypeScript chat interface with streaming support
- **API**: Ollama-compatible REST endpoints for model management and chat
- **Storage**: Client-side IndexedDB for chat persistence

## Quick Start

### 1. Install Dependencies

```bash
# Backend dependencies
pip install -r requirements.txt

# Frontend dependencies
cd ui
npm install
```

### 2. Configure Models

Edit `config/models.yaml`:
```yaml
models:
  phi3-mini-4k-instruct:
    path: "/path/to/your/model.gguf"
    name: "phi3-mini-4k-instruct"
```

### 3. Start the Server

```bash
# Start backend
./run_server.sh

# In another terminal, start frontend
cd ui
npm start
```

The web interface will be available at `http://localhost:3000`

## Development

### Backend (Python)

```bash
# Run server with auto-reload
python -m uvicorn src.server:app --host 0.0.0.0 --port 11434 --reload

# Run tests
pytest tests/
```

### Frontend (React)

```bash
cd ui

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

## API Endpoints

- `GET /health` - Health check
- `GET /api/tags` - List available models
- `POST /api/chat` - Chat completion
- `POST /api/generate` - Text generation
- `POST /api/generate/stream` - Streaming generation

API docs: http://localhost:11434/docs

## Project Structure

```
llama.cpp-web/
├── src/                 # Python backend
│   ├── server.py       # FastAPI app
│   ├── api/            # API routes
│   └── models/         # llama.cpp wrapper
├── ui/                 # React frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── store/      # Zustand state
│   │   └── services/   # API & database
│   └── package.json
├── config/
│   └── models.yaml     # Model configuration
└── requirements.txt
```

## Requirements

- Python 3.8+
- Node.js 16+
- llama.cpp installed (`llama-cli` command)
- Your model file (`.gguf` format) 