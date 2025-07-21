import React, { useRef, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { useModelStore } from '../store/modelStore';
import { useUIStore } from '../store/uiStore';
import { apiService } from '../services/api';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import ModelSelector from './ModelSelector';
import LoadingSpinner from './LoadingSpinner';
import '../styles/ChatWindow.css';

const ChatWindow: React.FC = () => {
  const { 
    currentChat, 
    messages, 
    addMessage, 
    updateChatTitle,
    error: chatError 
  } = useChatStore();
  
  const { selectedModel, error: modelError } = useModelStore();
  const { isGenerating, setGenerating } = useUIStore();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputError, setInputError] = React.useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!currentChat) {
      setInputError('No active chat. Please create a new chat first.');
      return;
    }

    if (!selectedModel) {
      setInputError('No model selected. Please select a model first.');
      return;
    }

    setInputError(null);
    setGenerating(true);

    try {
      // Add user message
      await addMessage(content, 'user');

      // Prepare messages for API
      const apiMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Add the new user message
      apiMessages.push({ role: 'user', content });

      // Send to API
      const response = await apiService.sendChat(selectedModel, apiMessages);
      
      // Add assistant response
      await addMessage(response.message.content, 'assistant');

      // Update chat title if it's the first message
      if (messages.length === 0) {
        const title = content.length > 30 ? content.substring(0, 30) + '...' : content;
        updateChatTitle(currentChat.id, title);
      }

    } catch (error) {
      setInputError(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  if (!currentChat) {
    return (
      <div className="chat-window chat-window--empty">
        <div className="chat-window__empty">
          <h2>Welcome to llama.cpp-web</h2>
          <p>Select a model and start a new chat to begin!</p>
          <ModelSelector />
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-window__header">
        <div className="chat-window__header-content">
          <h2 className="chat-window__title">{currentChat.title}</h2>
          <div className="chat-window__meta">
            <span className="chat-window__model">{currentChat.model}</span>
            <span className="chat-window__message-count">
              {messages.length} messages
            </span>
          </div>
        </div>
        <ModelSelector />
      </div>

      <div className="chat-window__messages">
        {messages.length === 0 ? (
          <div className="chat-window__empty-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id || `${message.chatId}-${message.timestamp}`}
              message={message}
              onCopy={handleCopyMessage}
            />
          ))
        )}
        
        {isGenerating && (
          <div className="chat-window__generating">
            <LoadingSpinner size="small" />
            <span>AI is thinking...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-window__input">
        {inputError && (
          <div className="chat-window__error">
            {inputError}
          </div>
        )}
        {(chatError || modelError) && (
          <div className="chat-window__error">
            {chatError || modelError}
          </div>
        )}
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={isGenerating}
          placeholder={isGenerating ? "AI is thinking..." : "Type your message..."}
        />
      </div>
    </div>
  );
};

export default ChatWindow; 