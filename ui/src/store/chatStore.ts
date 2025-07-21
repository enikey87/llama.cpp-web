import { create } from 'zustand';
import { Chat, Message } from '../types/chat';
import { databaseService } from '../services/database';

interface ChatStore {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  createChat: (title: string, model: string) => Promise<void>;
  loadChat: (chatId: string) => Promise<void>;
  addMessage: (content: string, role: 'user' | 'assistant') => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  loadChats: () => Promise<void>;
  updateChatTitle: (chatId: string, title: string) => Promise<void>;
  updateChatSettings: (chatId: string, sendFullHistory: boolean) => Promise<void>;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  currentChat: null,
  messages: [],
  isLoading: false,
  error: null,

  createChat: async (title: string, model: string) => {
    try {
      set({ isLoading: true, error: null });
      const chat = await databaseService.createChat(title, model);
      set(state => ({
        chats: [chat, ...state.chats],
        currentChat: chat,
        messages: [],
        isLoading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create chat', isLoading: false });
    }
  },

  loadChat: async (chatId: string) => {
    try {
      set({ isLoading: true, error: null });
      const chat = await databaseService.getChat(chatId);
      const messages = await databaseService.getMessages(chatId);
      set({ currentChat: chat, messages, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load chat', isLoading: false });
    }
  },

  addMessage: async (content: string, role: 'user' | 'assistant') => {
    try {
      const { currentChat } = get();
      if (!currentChat) return;
      
      const message = await databaseService.addMessage(currentChat.id, content, role);
      set(state => ({
        messages: [...state.messages, message]
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add message' });
    }
  },

  deleteChat: async (chatId: string) => {
    try {
      await databaseService.deleteChat(chatId);
      set(state => ({
        chats: state.chats.filter(chat => chat.id !== chatId),
        currentChat: state.currentChat?.id === chatId ? null : state.currentChat
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete chat' });
    }
  },

  loadChats: async () => {
    try {
      set({ isLoading: true, error: null });
      const chats = await databaseService.getChats();
      set({ chats, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load chats', isLoading: false });
    }
  },

  updateChatTitle: async (chatId: string, title: string) => {
    try {
      await databaseService.updateChatTitle(chatId, title);
      set(state => ({
        chats: state.chats.map(chat => 
          chat.id === chatId ? { ...chat, title, updatedAt: new Date().toISOString() } : chat
        ),
        currentChat: state.currentChat?.id === chatId 
          ? { ...state.currentChat, title, updatedAt: new Date().toISOString() }
          : state.currentChat
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update chat title' });
    }
  },

  updateChatSettings: async (chatId: string, sendFullHistory: boolean) => {
    try {
      await databaseService.updateChatSettings(chatId, sendFullHistory);
      set(state => ({
        chats: state.chats.map(chat => 
          chat.id === chatId ? { ...chat, sendFullHistory, updatedAt: new Date().toISOString() } : chat
        ),
        currentChat: state.currentChat?.id === chatId 
          ? { ...state.currentChat, sendFullHistory, updatedAt: new Date().toISOString() }
          : state.currentChat
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update chat settings' });
    }
  },

  setError: (error: string | null) => set({ error }),
  setLoading: (loading: boolean) => set({ isLoading: loading })
})); 