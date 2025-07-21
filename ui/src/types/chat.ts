export interface Chat {
  id: string;
  title: string;
  model: string;
  createdAt: string;
  updatedAt: string;
  sendFullHistory: boolean; // New field to store the setting per chat
}

export interface Message {
  id: string;
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
} 