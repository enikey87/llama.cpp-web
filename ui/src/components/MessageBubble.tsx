import React from 'react';
import { Message } from '../types/chat';
import '../styles/MessageBubble.css';

interface MessageBubbleProps {
  message: Message;
  onCopy?: (content: string) => void;
  isStreaming?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onCopy, isStreaming = false }) => {
  const timestamp = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const handleCopy = () => {
    if (onCopy) {
      onCopy(message.content);
    } else {
      navigator.clipboard.writeText(message.content);
    }
  };

  return (
    <div className={`message-bubble message-bubble--${message.role} ${isStreaming ? 'message-bubble--streaming' : ''}`}>
      <div className="message-bubble__content">
        <div className="message-bubble__text">
          {message.content}
          {isStreaming && (
            <span className="message-bubble__cursor">|</span>
          )}
        </div>
        <div className="message-bubble__footer">
          <span className="message-bubble__timestamp">{timestamp}</span>
          {!isStreaming && (
            <button 
              className="message-bubble__copy-btn"
              onClick={handleCopy}
              title="Copy message"
            >
              📋
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(MessageBubble); 