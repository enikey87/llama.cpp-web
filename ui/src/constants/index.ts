// API Configuration
export const DEFAULT_API_BASE = 'http://localhost:11434/api';

// Chat Configuration
export const DEFAULT_MODEL = 'phi3-mini-4k-instruct';
export const DEFAULT_CHAT_TITLE = 'New Chat';
export const MAX_MESSAGE_LENGTH = 4000;
export const TITLE_MAX_LENGTH = 30;

// UI Configuration
export const MESSAGE_COPY_TIMEOUT = 2000;
export const STREAMING_CURSOR_BLINK_INTERVAL = 500;
export const AUTO_SCROLL_DELAY = 100;

// Database Configuration
export const DB_NAME = 'llama_cpp_web_db';
export const DB_VERSION = 4;

// Error Messages
export const ERROR_MESSAGES = {
  MODEL_NOT_FOUND: 'Model not found. Please check your model selection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  MESSAGE_TOO_LONG: 'Message too long. Please shorten your message.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNKNOWN_ERROR: 'An unknown error occurred. Please try again.',
  NO_ACTIVE_CHAT: 'No active chat. Please create a new chat first.',
  NO_MODEL_SELECTED: 'No model selected. Please select a model first.',
} as const;

// Loading Messages
export const LOADING_MESSAGES = {
  GENERATING: 'AI is thinking...',
  LOADING_CHATS: 'Loading chats...',
  LOADING_MODELS: 'Loading models...',
  SENDING_MESSAGE: 'Sending message...',
} as const; 