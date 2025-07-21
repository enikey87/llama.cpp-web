import React from 'react';
import { useUIStore } from '../store/uiStore';
import { useChatStore } from '../store/chatStore';
import '../styles/Settings.css';

const Settings: React.FC = () => {
  const { 
    theme, 
    setTheme 
  } = useUIStore();

  const { 
    currentChat, 
    updateChatSettings 
  } = useChatStore();

  const handleSendFullHistoryChange = async (sendFullHistory: boolean) => {
    if (currentChat) {
      await updateChatSettings(currentChat.id, sendFullHistory);
    }
  };

  return (
    <div className="settings">
      <div className="settings__section">
        <h3 className="settings__title">Appearance</h3>
        <div className="settings__option">
          <label className="settings__label">
            <span>Theme</span>
            <select 
              value={theme} 
              onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
              className="settings__select"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </div>
      </div>

      <div className="settings__section">
        <h3 className="settings__title">Chat Settings</h3>
        <div className="settings__option">
          <label className="settings__label">
            <div className="settings__label-content">
              <span>Send full chat history</span>
              <span className="settings__description">
                When enabled, sends the entire conversation to the AI. When disabled, only sends the current message (reduces CPU load).
                {currentChat && (
                  <span className="settings__note">
                    This setting is saved per chat and will persist across sessions.
                  </span>
                )}
              </span>
            </div>
            <input
              type="checkbox"
              checked={currentChat?.sendFullHistory ?? true}
              onChange={(e) => handleSendFullHistoryChange(e.target.checked)}
              className="settings__checkbox"
              disabled={!currentChat}
            />
          </label>
          {!currentChat && (
            <div className="settings__note">
              Create a chat first to configure this setting.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings; 