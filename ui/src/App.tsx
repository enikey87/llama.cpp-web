import React, { useState } from 'react';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import Settings from './components/Settings';
import ChatErrorBoundary from './components/ErrorBoundary';
import { useUIStore } from './store/uiStore';
import './App.css';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const { theme } = useUIStore();

  return (
    <div className="app" data-theme={theme}>
      <ChatErrorBoundary>
        <div className="app__sidebar">
          <div className="app__sidebar-header">
            <h1 className="app__title">llama.cpp-web</h1>
            <button 
              onClick={() => setShowSettings(true)}
              className="app__settings-btn"
              title="Settings"
            >
              ⚙️
            </button>
          </div>
          <ChatList />
        </div>
        <div className="app__main">
          <ChatWindow />
        </div>
      </ChatErrorBoundary>
      
      {showSettings && (
        <div className="app__modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="app__modal" onClick={(e) => e.stopPropagation()}>
            <div className="app__modal-header">
              <h2>Settings</h2>
              <button 
                onClick={() => setShowSettings(false)}
                className="app__modal-close"
              >
                ×
              </button>
            </div>
            <Settings />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
