# llama.cpp-web React UI

A modern React web application that provides a chat interface for the llama.cpp-web Python REST API server.

## Features

- **Chat Management**: Create, continue, and delete conversations
- **Model Selection**: Choose from available AI models
- **Persistent Storage**: SQLite database for chat history
- **Modern UI**: Clean, responsive design with dark/light theme support
- **Real-time Chat**: Send messages and receive AI responses
- **Message Copy**: Copy individual messages to clipboard
- **Error Handling**: Graceful error handling and loading states

## Technology Stack

- **React 18** with TypeScript
- **Zustand** for state management
- **SQLite** (better-sqlite3) for persistent storage
- **Axios** for API communication
- **React Router** for navigation
- **CSS** for styling

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- The Python server running on `http://localhost:11434`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ChatList.tsx    # Sidebar chat list
│   ├── ChatWindow.tsx  # Main chat interface
│   ├── MessageBubble.tsx # Individual message display
│   ├── MessageInput.tsx # Message input component
│   ├── ModelSelector.tsx # Model selection dropdown
│   └── LoadingSpinner.tsx # Loading indicator
├── services/           # API and database services
│   ├── api.ts         # API communication
│   └── database.ts    # SQLite database operations
├── store/             # Zustand state stores
│   ├── chatStore.ts   # Chat state management
│   ├── modelStore.ts  # Model state management
│   └── uiStore.ts     # UI state management
├── types/             # TypeScript type definitions
│   ├── chat.ts        # Chat-related types
│   ├── model.ts       # Model-related types
│   └── api.ts         # API-related types
├── styles/            # CSS files
└── utils/             # Utility functions
```

## API Integration

The app integrates with the following Python server endpoints:

- `GET /api/tags` - List available models
- `POST /api/chat` - Send chat messages
- `GET /api/health` - Health check

## Database Schema

The SQLite database stores:

- **Chats**: Chat metadata (id, title, model, timestamps)
- **Messages**: Individual messages with role and content
- **Settings**: Application settings

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### State Management

The app uses Zustand for state management with three main stores:

1. **ChatStore**: Manages chats, messages, and current chat
2. **ModelStore**: Manages available models and selection
3. **UIStore**: Manages UI state (theme, sidebar, loading)

### Styling

The app uses CSS modules and follows a BEM-like naming convention for maintainable styles.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the llama.cpp-web ecosystem.
