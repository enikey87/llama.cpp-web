export interface Chat {
  id: string;
  title: string;
  model: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id?: number;
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
} 