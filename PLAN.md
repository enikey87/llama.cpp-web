# Implementation Plan: Ollama-Compatible REST API for llama.cpp

## Objective
Create a FastAPI web server that wraps llama.cpp CLI commands and exposes them through Ollama-compatible REST API endpoints for JetBrains AI Assistant integration.

## Technical Requirements
- FastAPI web server on port 11434
- Ollama API compatibility (tags, generate, chat, show endpoints)
- llama.cpp CLI integration via subprocess
- Streaming response support
- Model configuration management

## Technical Architecture

### 1. Core Components

#### A. Web Server Framework
- **Technology**: FastAPI (Python) or Express.js (Node.js)
- **Rationale**: FastAPI provides excellent async support, automatic OpenAPI docs, and type safety
- **Alternative**: Express.js if Python environment is not preferred

#### B. Model Management
- **Model Registry**: Track available models and their paths
- **Model Loading**: Dynamic model loading/unloading
- **Configuration**: YAML/JSON config for model definitions

#### C. API Endpoints (Ollama-Compatible)
- `GET /api/tags` - List available models
- `POST /api/generate` - Generate completions
- `POST /api/chat` - Chat completions
- `GET /api/show` - Model information
- `POST /api/pull` - Model management (stub)
- `POST /api/push` - Model management (stub)

## Implementation Steps

### Step 1: Project Setup
1. Create `requirements.txt` with dependencies:
   ```
   fastapi==0.104.1
   uvicorn==0.24.0
   pydantic==2.5.0
   pyyaml==6.0.1
   ```

2. Create project structure:
   ```
   src/
   ├── server.py
   ├── models/
   │   ├── __init__.py
   │   ├── llama_wrapper.py
   │   └── registry.py
   ├── api/
   │   ├── __init__.py
   │   ├── routes.py
   │   └── schemas.py
   └── utils/
       ├── __init__.py
       ├── config.py
       └── logging.py
   config/
   └── models.yaml
   ```

3. Create `config/models.yaml`:
   ```yaml
   models:
     phi3-mini-4k-instruct:
       path: "/Users/enikey87/llm/phi3-mini-4k-instruct-q4.gguf"
       name: "phi3-mini-4k-instruct"
       parameters:
         temperature: 0.7
         top_p: 0.9
         max_tokens: 2048
   server:
     host: "0.0.0.0"
     port: 11434
   ```

### Step 2: Core Server Implementation
1. Create `src/server.py` with FastAPI app
2. Add CORS middleware
3. Add health check endpoint
4. Set up logging configuration

### Step 3: Model Wrapper Implementation
1. Create `src/models/llama_wrapper.py`:
   - LlamaCppModel class
   - Subprocess management for llama-cli
   - Parameter mapping (Ollama → llama.cpp)
   - Streaming response handling

### Step 4: API Endpoints Implementation
1. Implement `/api/tags` - List available models
2. Implement `/api/generate` - Text generation
3. Implement `/api/chat` - Chat completions
4. Implement `/api/show` - Model information

## Technical Implementation Details

### API Request/Response Formats

#### Ollama Generate Request:
```json
{
  "model": "phi3-mini-4k-instruct",
  "prompt": "Hello, how are you?",
  "stream": false,
  "options": {
    "temperature": 0.7,
    "top_p": 0.9,
    "max_tokens": 100
  }
}
```

#### Ollama Generate Response:
```json
{
  "model": "phi3-mini-4k-instruct",
  "created_at": "2024-01-01T00:00:00Z",
  "response": "I'm doing well, thank you for asking!",
  "done": true,
  "context": [],
  "total_duration": 1234567890,
  "load_duration": 123456789,
  "prompt_eval_duration": 123456789,
  "eval_duration": 123456789
}
```

#### Parameter Mapping (Ollama → llama.cpp):
- `temperature` → `--temp`
- `top_p` → `--top-p`
- `max_tokens` → `--n-predict`
- `top_k` → `--top-k`
- `repeat_penalty` → `--repeat-penalty`

### llama.cpp CLI Integration

#### Non-interactive command format:
```bash
llama-cli -m /Users/enikey87/llm/phi3-mini-4k-instruct-q4.gguf --temp 0.7 --top-p 0.9 --n-predict 100
```

#### Subprocess implementation:
```python
async def generate_response(prompt, model_config, options):
    cmd = [
        "llama-cli",
        "-m", model_config["path"],
        "--temp", str(options.get("temperature", 0.7)),
        "--top-p", str(options.get("top_p", 0.9)),
        "--n-predict", str(options.get("max_tokens", 2048))
    ]
    
    process = await asyncio.create_subprocess_exec(
        *cmd,
        stdin=asyncio.subprocess.PIPE,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )
    
    stdout, stderr = await process.communicate(input=prompt.encode())
    return stdout.decode().strip()
```

## File Implementation Order

### 1. `requirements.txt`
```txt
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
pyyaml==6.0.1
```

### 2. `config/models.yaml`
```yaml
models:
  phi3-mini-4k-instruct:
    path: "/Users/enikey87/llm/phi3-mini-4k-instruct-q4.gguf"
    name: "phi3-mini-4k-instruct"
    parameters:
      temperature: 0.7
      top_p: 0.9
      max_tokens: 2048
server:
  host: "0.0.0.0"
  port: 11434
```

### 3. `src/utils/config.py`
- Load YAML configuration
- Validate model paths
- Provide configuration access

### 4. `src/models/llama_wrapper.py`
- LlamaCppModel class
- Subprocess management
- Parameter mapping
- Response parsing

### 5. `src/api/schemas.py`
- Pydantic models for requests/responses
- Ollama API compatibility

### 6. `src/api/routes.py`
- API endpoint implementations
- Error handling
- Response formatting

### 7. `src/server.py`
- FastAPI application
- CORS middleware
- Route registration
- Health check endpoint

### 8. `README.md`
- Installation instructions
- Usage examples
- JetBrains integration guide

## Testing Strategy

### 1. Unit Tests
- Model wrapper functionality
- Parameter mapping validation
- Configuration loading

### 2. Integration Tests
- End-to-end API calls
- llama.cpp CLI integration
- Response format validation

### 3. Compatibility Tests
- Ollama client library compatibility
- JetBrains AI Assistant integration

## Validation Steps

### 1. Server Startup
```bash
cd llama.cpp-web
pip install -r requirements.txt
python -m uvicorn src.server:app --host 0.0.0.0 --port 11434
```

### 2. API Testing
```bash
# Test /api/tags
curl http://localhost:11434/api/tags

# Test /api/generate
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "phi3-mini-4k-instruct",
    "prompt": "Hello, how are you?",
    "stream": false
  }'
```

### 3. JetBrains Integration
1. Install Ollama plugin in JetBrains
2. Configure server URL: `http://localhost:11434`
3. Test model availability
4. Verify chat functionality

## Success Criteria

### Functional Requirements
- [ ] Server starts on port 11434
- [ ] `/api/tags` returns available models
- [ ] `/api/generate` processes requests and returns responses
- [ ] `/api/chat` handles chat completions
- [ ] `/api/show` provides model information
- [ ] All responses match Ollama API format
- [ ] Parameter mapping works correctly
- [ ] Error handling is robust

### Performance Requirements
- [ ] Response time < 5 seconds for typical requests
- [ ] Server handles concurrent requests
- [ ] Memory usage remains stable
- [ ] Subprocess cleanup works properly

### Integration Requirements
- [ ] JetBrains AI Assistant can connect
- [ ] Ollama client libraries work
- [ ] Model responses are coherent
- [ ] Streaming responses work (optional)

## Implementation Priority

### High Priority (Must Have)
1. Basic FastAPI server
2. `/api/generate` endpoint
3. llama.cpp CLI integration
4. Parameter mapping
5. Error handling

### Medium Priority (Should Have)
1. `/api/tags` endpoint
2. `/api/show` endpoint
3. Configuration management
4. Response formatting

### Low Priority (Nice to Have)
1. `/api/chat` endpoint
2. Streaming responses
3. Advanced error handling
4. Performance optimization

## Execution Checklist

### Phase 1: Foundation (Day 1-2)
- [ ] Create project structure
- [ ] Set up dependencies (requirements.txt)
- [ ] Create configuration files
- [ ] Implement basic FastAPI server
- [ ] Add health check endpoint

### Phase 2: Core Functionality (Day 3-4)
- [ ] Implement llama.cpp wrapper
- [ ] Create `/api/generate` endpoint
- [ ] Add parameter mapping
- [ ] Test basic generation

### Phase 3: API Completeness (Day 5-6)
- [ ] Implement `/api/tags` endpoint
- [ ] Implement `/api/show` endpoint
- [ ] Add error handling
- [ ] Test all endpoints

### Phase 4: Integration (Day 7)
- [ ] Test with JetBrains AI Assistant
- [ ] Validate Ollama compatibility
- [ ] Document usage instructions
- [ ] Create README.md

## Ready to Implement

This plan is now structured for direct implementation by an LLM agent with:
- Clear file creation order
- Specific code examples
- Concrete validation steps
- Prioritized requirements
- Success criteria checklists

The implementation can begin immediately with the file creation order specified above. 