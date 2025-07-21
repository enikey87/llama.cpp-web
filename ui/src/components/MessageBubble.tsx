import React from 'react';
import { Message } from '../types/chat';
import '../styles/MessageBubble.css';

interface MessageBubbleProps {
  message: Message;
  onCopy?: (content: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onCopy }) => {
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
    <div className={`message-bubble message-bubble--${message.role}`}>
      <div className="message-bubble__content">
        <div className="message-bubble__text">
          {message.content}
        </div>
        <div className="message-bubble__footer">
          <span className="message-bubble__timestamp">{timestamp}</span>
          <button 
            className="message-bubble__copy-btn"
            onClick={handleCopy}
            title="Copy message"
          >
            📋
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble; 