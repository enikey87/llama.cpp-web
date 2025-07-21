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
  const { isGenerating, setGenerating, sendFullHistory } = useUIStore();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputError, setInputError] = React.useState<string | null>(null);
  const [streamingMessage, setStreamingMessage] = React.useState<string>('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

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
    setStreamingMessage('');

    try {
      // Add user message
      await addMessage(content, 'user');

      // Prepare messages for API
      let apiMessages: Array<{ role: 'user' | 'assistant'; content: string }>;
      
      if (sendFullHistory) {
        // Send full chat history
        apiMessages = messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }));
        apiMessages.push({ role: 'user', content });
      } else {
        // Send only the current message
        apiMessages = [{ role: 'user', content }];
      }

      // Use streaming for better UX
      await apiService.sendChatStream(
        selectedModel,
        apiMessages,
        {},
        // onChunk callback
        (chunk: string) => {
          setStreamingMessage(prev => prev + chunk);
        },
        // onComplete callback
        async (response) => {
          // Add the complete assistant message
          await addMessage(response.message.content, 'assistant');
          setStreamingMessage('');
          
          // Update chat title if it's the first message
          if (messages.length === 0) {
            const title = content.length > 30 ? content.substring(0, 30) + '...' : content;
            updateChatTitle(currentChat.id, title);
          }
        },
        // onError callback
        (error: string) => {
          setInputError(error);
          setStreamingMessage('');
        }
      );

    } catch (error) {
      setInputError(error instanceof Error ? error.message : 'Failed to send message');
      setStreamingMessage('');
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
            {!sendFullHistory && (
              <span className="chat-window__mode-indicator">
                (Single message mode)
              </span>
            )}
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
        
        {/* Show streaming message */}
        {streamingMessage && (
          <div className="chat-window__streaming-message">
            <MessageBubble
              message={{
                id: 'streaming',
                chatId: currentChat.id,
                role: 'assistant',
                content: streamingMessage,
                timestamp: new Date().toISOString()
              }}
              onCopy={handleCopyMessage}
              isStreaming={true}
            />
          </div>
        )}
        
        {isGenerating && !streamingMessage && (
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