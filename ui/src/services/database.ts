import { Chat, Message } from '../types/chat';

class DatabaseService {
  private readonly CHATS_KEY = 'llama_cpp_web_chats';
  private readonly MESSAGES_KEY = 'llama_cpp_web_messages';

  private getChatsFromStorage(): Chat[] {
    try {
      const stored = localStorage.getItem(this.CHATS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private setChatsToStorage(chats: Chat[]): void {
    localStorage.setItem(this.CHATS_KEY, JSON.stringify(chats));
  }

  private getMessagesFromStorage(): Record<string, Message[]> {
    try {
      const stored = localStorage.getItem(this.MESSAGES_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  private setMessagesToStorage(messages: Record<string, Message[]>): void {
    localStorage.setItem(this.MESSAGES_KEY, JSON.stringify(messages));
  }

  async createChat(title: string, model: string): Promise<Chat> {
    const chat: Chat = {
      id: crypto.randomUUID(),
      title,
      model,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const chats = this.getChatsFromStorage();
    chats.unshift(chat);
    this.setChatsToStorage(chats);

    return chat;
  }

  async getChats(): Promise<Chat[]> {
    return this.getChatsFromStorage();
  }

  async getChat(chatId: string): Promise<Chat> {
    const chats = this.getChatsFromStorage();
    const chat = chats.find(c => c.id === chatId);
    if (!chat) {
      throw new Error('Chat not found');
    }
    return chat;
  }

  async addMessage(chatId: string, content: string, role: 'user' | 'assistant'): Promise<Message> {
    const message: Message = {
      chatId,
      role,
      content,
      timestamp: new Date().toISOString()
    };

    const messages = this.getMessagesFromStorage();
    if (!messages[chatId]) {
      messages[chatId] = [];
    }
    messages[chatId].push(message);
    this.setMessagesToStorage(messages);

    // Update chat's updatedAt timestamp
    const chats = this.getChatsFromStorage();
    const chatIndex = chats.findIndex(c => c.id === chatId);
    if (chatIndex !== -1) {
      chats[chatIndex].updatedAt = new Date().toISOString();
      this.setChatsToStorage(chats);
    }

    return message;
  }

  async getMessages(chatId: string): Promise<Message[]> {
    const messages = this.getMessagesFromStorage();
    return messages[chatId] || [];
  }

  async deleteChat(chatId: string): Promise<void> {
    // Remove chat
    const chats = this.getChatsFromStorage();
    const filteredChats = chats.filter(c => c.id !== chatId);
    this.setChatsToStorage(filteredChats);

    // Remove messages
    const messages = this.getMessagesFromStorage();
    delete messages[chatId];
    this.setMessagesToStorage(messages);
  }

  async updateChatTitle(chatId: string, title: string): Promise<void> {
    const chats = this.getChatsFromStorage();
    const chatIndex = chats.findIndex(c => c.id === chatId);
    if (chatIndex !== -1) {
      chats[chatIndex].title = title;
      chats[chatIndex].updatedAt = new Date().toISOString();
      this.setChatsToStorage(chats);
    }
  }
}

export const databaseService = new DatabaseService(); 