import React from 'react';
import { useChatStore } from '../store/chatStore';
import { Chat } from '../types/chat';
import { DEFAULT_MODEL, DEFAULT_CHAT_TITLE, LOADING_MESSAGES } from '../constants';
import '../styles/ChatList.css';

const ChatList: React.FC = () => {
  const { 
    chats, 
    currentChat, 
    isLoading, 
    error, 
    loadChats, 
    createChat, 
    deleteChat, 
    loadChat 
  } = useChatStore();

  React.useEffect(() => {
    loadChats();
  }, [loadChats]);

  const handleNewChat = () => {
    createChat(DEFAULT_CHAT_TITLE, DEFAULT_MODEL);
  };

  const handleChatClick = (chat: Chat) => {
    loadChat(chat.id);
  };

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat?')) {
      deleteChat(chatId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (isLoading) {
    return (
      <div className="chat-list">
        <div className="chat-list__loading">{LOADING_MESSAGES.LOADING_CHATS}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-list">
        <div className="chat-list__error">
          Error: {error}
          <button onClick={loadChats} className="chat-list__retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-list">
      <div className="chat-list__header">
        <h2 className="chat-list__title">Chats</h2>
        <button 
          onClick={handleNewChat}
          className="chat-list__new-btn"
          title="New Chat"
        >
          +
        </button>
      </div>
      
      <div className="chat-list__items">
        {chats.length === 0 ? (
          <div className="chat-list__empty">
            <p>No chats yet</p>
            <button onClick={handleNewChat} className="chat-list__empty-btn">
              Start a new chat
            </button>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-list__item ${currentChat?.id === chat.id ? 'chat-list__item--active' : ''}`}
              onClick={() => handleChatClick(chat)}
            >
              <div className="chat-list__item-content">
                <div className="chat-list__item-title">{chat.title}</div>
                <div className="chat-list__item-meta">
                  <span className="chat-list__item-model">{chat.model}</span>
                  <span className="chat-list__item-time">{formatDate(chat.updatedAt)}</span>
                </div>
              </div>
              <button
                onClick={(e) => handleDeleteChat(e, chat.id)}
                className="chat-list__delete-btn"
                title="Delete chat"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList; 