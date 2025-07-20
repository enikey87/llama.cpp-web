# llama.cpp-web

An Ollama-compatible REST API server that wraps llama.cpp CLI commands, enabling integration with JetBrains AI Assistant and other Ollama-compatible tools.

## Features

- 🚀 **Ollama API Compatibility**: Full compatibility with Ollama REST API endpoints
- 🤖 **llama.cpp Integration**: Direct integration with llama.cpp CLI
- 💬 **Chat Support**: Chat completion endpoints for conversational AI
- 📊 **Model Management**: Dynamic model loading and configuration
- 🔄 **Streaming Support**: Real-time response streaming
- 🛠️ **JetBrains Integration**: Ready for JetBrains AI Assistant

## Installation

### Prerequisites

- Python 3.8+
- llama.cpp installed and accessible via `llama-cli` command
- Your model file (e.g., `phi3-mini-4k-instruct-q4.gguf`)

### Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd llama.cpp-web
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure your models**:
   Edit `config/models.yaml` to point to your model files:
   ```yaml
   models:
     phi3-mini-4k-instruct:
       path: "/path/to/your/phi3-mini-4k-instruct-q4.gguf"
       name: "phi3-mini-4k-instruct"
       parameters:
         temperature: 0.7
         top_p: 0.9
         max_tokens: 2048
   server:
     host: "0.0.0.0"
     port: 11434
   ```

## Usage

### Starting the Server

```bash
# Development mode with auto-reload
python -m uvicorn src.server:app --host 0.0.0.0 --port 11434 --reload

# Or run directly
python src/server.py
```

The server will start on `http://localhost:11434`

### API Endpoints

#### List Models
```bash
curl http://localhost:11434/api/tags
```

#### Generate Text
```bash
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "phi3-mini-4k-instruct",
    "prompt": "Hello, how are you?",
    "stream": false,
    "options": {
      "temperature": 0.7,
      "top_p": 0.9,
      "max_tokens": 100
    }
  }'
```

#### Chat Completion
```bash
curl -X POST http://localhost:11434/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "phi3-mini-4k-instruct",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ],
    "stream": false
  }'
```

#### Show Model Info
```bash
curl -X POST http://localhost:11434/api/show \
  -H "Content-Type: application/json" \
  -d '{"name": "phi3-mini-4k-instruct"}'
```

#### Health Check
```bash
curl http://localhost:11434/health
```

### API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:11434/docs
- **ReDoc**: http://localhost:11434/redoc

## JetBrains AI Assistant Integration

### Setup

1. **Install Ollama Plugin**:
   - Open JetBrains IDE (IntelliJ IDEA, PyCharm, etc.)
   - Go to Settings/Preferences → Plugins
   - Search for "Ollama" and install the plugin

2. **Configure Custom Server**:
   - Go to Settings/Preferences → Tools → Ollama
   - Set the server URL to: `http://localhost:11434`
   - Click "Test Connection" to verify

3. **Use AI Assistant**:
   - Open the AI Assistant tool window
   - Select your model from the dropdown
   - Start chatting with your local llama.cpp model!

### Troubleshooting

- **Connection Failed**: Ensure the server is running on port 11434
- **Model Not Found**: Check your `config/models.yaml` configuration
- **Permission Denied**: Verify llama-cli is executable and accessible

## Configuration

### Model Parameters

The following parameters are supported and mapped to llama.cpp CLI arguments:

| Ollama Parameter | llama.cpp Argument | Description |
|------------------|-------------------|-------------|
| `temperature` | `--temp` | Sampling temperature |
| `top_p` | `--top-p` | Top-p sampling |
| `max_tokens` | `--n-predict` | Maximum tokens to generate |
| `top_k` | `--top-k` | Top-k sampling |
| `repeat_penalty` | `--repeat-penalty` | Repeat penalty |

### Server Configuration

Edit `config/models.yaml` to customize:

```yaml
server:
  host: "0.0.0.0"  # Server host
  port: 11434       # Server port

models:
  your-model-name:
    path: "/path/to/model.gguf"
    name: "display-name"
    parameters:
      temperature: 0.7
      top_p: 0.9
      max_tokens: 2048
```

## Development

### Project Structure

```
llama.cpp-web/
├── src/
│   ├── server.py          # Main FastAPI application
│   ├── models/
│   │   ├── __init__.py
│   │   └── llama_wrapper.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes.py
│   │   └── schemas.py
│   └── utils/
│       ├── __init__.py
│       ├── config.py
│       └── logging.py
├── config/
│   └── models.yaml
├── requirements.txt
└── README.md
```

### Running Tests

```bash
# Install test dependencies
pip install pytest

# Run tests
pytest tests/
```

### Adding New Models

1. Add your model file to a known location
2. Update `config/models.yaml` with the model path and parameters
3. Restart the server

## Troubleshooting

### Common Issues

1. **llama-cli not found**:
   - Ensure llama.cpp is installed and `llama-cli` is in your PATH
   - Test with: `llama-cli --help`

2. **Model file not found**:
   - Check the path in `config/models.yaml`
   - Ensure the file exists and is readable

3. **Permission denied**:
   - Make sure the model file has read permissions
   - Check llama-cli executable permissions

4. **Server won't start**:
   - Check if port 11434 is already in use
   - Verify all dependencies are installed

### Logs

The server logs important events. Check the console output for:
- Model loading status
- API request/response details
- Error messages

## License

This project is open source. See LICENSE for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Support

For issues and questions:
- Check the troubleshooting section
- Review the logs for error messages
- Open an issue on GitHub 