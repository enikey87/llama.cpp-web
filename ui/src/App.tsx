import React from 'react';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import './App.css';

function App() {
  return (
    <div className="app">
      <div className="app__sidebar">
        <ChatList />
      </div>
      <div className="app__main">
        <ChatWindow />
      </div>
    </div>
  );
}

export default App;
