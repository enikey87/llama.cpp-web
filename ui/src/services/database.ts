import Dexie, { Table } from 'dexie';
import { Chat, Message } from '../types/chat';

// Define the database class
class ChatDatabase extends Dexie {
  chats!: Table<Chat>;
  messages!: Table<Message>;

  constructor() {
    super('llama_cpp_web_db');
    
    // Define database schema with string IDs
    this.version(1).stores({
      chats: 'id, title, model, createdAt, updatedAt',
      messages: 'id, chatId, role, content, timestamp'
    });

    // Version 2: Clear existing data to handle schema changes
    this.version(2).stores({
      chats: 'id, title, model, createdAt, updatedAt',
      messages: 'id, chatId, role, content, timestamp'
    }).upgrade(tx => {
      // Clear existing data to avoid conflicts
      return tx.table('chats').clear().then(() => {
        return tx.table('messages').clear();
      });
    });

    // Version 3: Add sendFullHistory field to chats
    this.version(3).stores({
      chats: 'id, title, model, createdAt, updatedAt, sendFullHistory',
      messages: 'id, chatId, role, content, timestamp'
    }).upgrade(tx => {
      // Add sendFullHistory field to existing chats
      return tx.table('chats').toCollection().modify(chat => {
        chat.sendFullHistory = true; // Default value for existing chats
      });
    });

    // Version 4: Add compound index for chatId + timestamp ordering
    this.version(4).stores({
      chats: 'id, title, model, createdAt, updatedAt, sendFullHistory',
      messages: 'id, chatId, role, content, timestamp, [chatId+timestamp]'
    });
  }
}

// Create database instance
const db = new ChatDatabase();

class DatabaseService {
  async createChat(title: string, model: string): Promise<Chat> {
    const chat: Chat = {
      id: crypto.randomUUID(),
      title,
      model,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sendFullHistory: true // Default to sending full history
    };

    await db.chats.add(chat);
    return chat;
  }

  async getChats(): Promise<Chat[]> {
    return await db.chats
      .orderBy('updatedAt')
      .reverse()
      .toArray();
  }

  async getChat(chatId: string): Promise<Chat> {
    const chat = await db.chats.get(chatId);
    if (!chat) {
      throw new Error('Chat not found');
    }
    return chat;
  }

  async addMessage(chatId: string, content: string, role: 'user' | 'assistant'): Promise<Message> {
    const message: Message = {
      id: crypto.randomUUID(),
      chatId,
      role,
      content,
      timestamp: new Date().toISOString()
    };

    // Add message to database
    await db.messages.add(message);

    // Update chat's updatedAt timestamp
    await db.chats.update(chatId, {
      updatedAt: new Date().toISOString()
    });

    return message;
  }

  async getMessages(chatId: string): Promise<Message[]> {
    return await db.messages
      .where('chatId')
      .equals(chatId)
      .toArray()
      .then(messages => messages.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      ));
  }

  async deleteChat(chatId: string): Promise<void> {
    // Use transaction to ensure data consistency
    await db.transaction('rw', [db.chats, db.messages], async () => {
      // Delete chat
      await db.chats.delete(chatId);
      
      // Delete all messages for this chat
      await db.messages
        .where('chatId')
        .equals(chatId)
        .delete();
    });
  }

  async updateChatTitle(chatId: string, title: string): Promise<void> {
    await db.chats.update(chatId, {
      title,
      updatedAt: new Date().toISOString()
    });
  }

  async updateChatSettings(chatId: string, sendFullHistory: boolean): Promise<void> {
    await db.chats.update(chatId, {
      sendFullHistory,
      updatedAt: new Date().toISOString()
    });
  }

  // Additional utility methods
  async getChatMessageCount(chatId: string): Promise<number> {
    return await db.messages
      .where('chatId')
      .equals(chatId)
      .count();
  }

  async searchChats(query: string): Promise<Chat[]> {
    return await db.chats
      .where('title')
      .startsWithIgnoreCase(query)
      .toArray();
  }

  async clearAllData(): Promise<void> {
    await db.transaction('rw', [db.chats, db.messages], async () => {
      await db.chats.clear();
      await db.messages.clear();
    });
  }
}

export const databaseService = new DatabaseService(); 