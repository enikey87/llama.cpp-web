# React Web App Plan for llama.cpp-web

## Overview
Create a React web application that provides a chat interface for the llama.cpp-web Python REST API server. The app will allow users to create and continue conversations with AI models using TypeScript, Zustand for state management, and SQLite for persistent storage.

## API Endpoints Available
- `GET /api/tags` - List available models
- `POST /api/chat` - Chat completion (non-streaming)
- `POST /api/generate` - Text generation
- `GET /api/health` - Health check
- `POST /api/show` - Model information

## Project Structure
Create the following folder structure:
- `ui/` - Main React application directory
- `src/components/` - React components (ChatList, ChatWindow, MessageInput, MessageBubble, ModelSelector, LoadingSpinner)
- `src/services/` - API and database services
- `src/store/` - Zustand state stores (chat, model, UI)
- `src/types/` - TypeScript type definitions
- `src/hooks/` - Custom React hooks
- `src/utils/` - Utility functions
- `src/styles/` - CSS files
- `database/` - SQLite schema and database files

## Core Features

### 1. Chat Management
- Create a sidebar showing all conversations with titles and timestamps
- Implement new chat functionality
- Store chat history in SQLite database
- Enable continuing existing conversations

### 2. Chat Interface
- Display user and AI messages with different styling
- Create text input area with send functionality
- Show typing indicators during AI response generation
- Display timestamps for messages

### 3. Model Selection
- Create dropdown to select from available models
- Display current model information
- Allow model switching during conversations

### 4. API Integration
- Integrate with `/api/chat` endpoint for conversations
- Fetch available models from `/api/tags`
- Implement error handling for API failures
- Show loading indicators during API calls

## Technical Implementation

### 1. Setup Tasks
- Initialize React app with TypeScript template
- Install required dependencies (zustand, better-sqlite3, axios, react-router-dom)
- Set up project structure and routing

### 2. Component Development Tasks
- Create ChatList component for sidebar conversation list
- Create ChatWindow component for main chat interface
- Create MessageBubble component for individual messages
- Create ModelSelector component for model selection
- Create LoadingSpinner component for loading states

### 3. State Management Tasks
- Implement Zustand stores for chat, model, and UI state
- Create database service for SQLite operations
- Implement API service for server communication
- Add TypeScript type definitions

### 4. Database Tasks
- Set up SQLite database with chats, messages, and settings tables
- Create indexes for performance optimization
- Implement database service for CRUD operations

### 5. UI/UX Tasks
- Design responsive layout with sidebar and main area
- Implement modern styling with theme support
- Create mobile-friendly design
- Add keyboard shortcuts and accessibility features

## Development Phases

### Phase 1: Basic Setup
- Create React app with TypeScript
- Set up project structure and dependencies
- Create basic routing and layout

### Phase 2: Core Components
- Implement ChatList component
- Implement ChatWindow component
- Implement MessageBubble component
- Create basic styling and layout

### Phase 3: API Integration
- Create API service layer
- Implement model fetching from server
- Implement chat completion functionality
- Add error handling and loading states

### Phase 4: State Management & Database
- Implement Zustand stores for state management
- Set up SQLite database with proper schema
- Create database service for persistence
- Add chat management functionality (create, delete, continue)
- Implement model selection and switching

### Phase 5: Polish & Features
- Add copy message functionality
- Implement theme switching
- Add keyboard shortcuts
- Ensure mobile responsiveness
- Add error boundaries and error handling

## Success Criteria
- Users can create new chats
- Users can continue existing chats
- Users can select different models
- Messages are persisted in SQLite database
- API integration works correctly with the Python server
- UI is responsive and modern
- Error handling is graceful
- Loading states are clear and informative 