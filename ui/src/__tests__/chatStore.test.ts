import { renderHook, act } from '@testing-library/react';
import { useChatStore } from '../store/chatStore';
import { databaseService } from '../services/database';

// Mock the database service
jest.mock('../services/database', () => ({
  databaseService: {
    createChat: jest.fn(),
    getChats: jest.fn(),
    getChat: jest.fn(),
    addMessage: jest.fn(),
    deleteChat: jest.fn(),
    updateChatTitle: jest.fn(),
    updateChatSettings: jest.fn(),
    getMessages: jest.fn(),
  }
}));

const mockDatabaseService = databaseService as jest.Mocked<typeof databaseService>;

describe('chatStore', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Reset store state
    act(() => {
      useChatStore.getState().setError(null);
      useChatStore.getState().setLoading(false);
    });
  });

  describe('createChat', () => {
    it('should create a new chat successfully', async () => {
      const mockChat = {
        id: 'test-chat-id',
        title: 'Test Chat',
        model: 'test-model',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        sendFullHistory: true
      };

      mockDatabaseService.createChat.mockResolvedValue(mockChat);

      const { result } = renderHook(() => useChatStore());

      await act(async () => {
        await result.current.createChat('Test Chat', 'test-model');
      });

      expect(mockDatabaseService.createChat).toHaveBeenCalledWith('Test Chat', 'test-model');
      expect(result.current.currentChat).toEqual(mockChat);
      expect(result.current.chats).toContain(mockChat);
      expect(result.current.messages).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle createChat error', async () => {
      const errorMessage = 'Failed to create chat';
      mockDatabaseService.createChat.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useChatStore());

      await act(async () => {
        await result.current.createChat('Test Chat', 'test-model');
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('loadChat', () => {
    it('should load a chat successfully', async () => {
      const mockChat = {
        id: 'test-chat-id',
        title: 'Test Chat',
        model: 'test-model',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        sendFullHistory: true
      };

      const mockMessages = [
        {
          id: 'msg-1',
          chatId: 'test-chat-id',
          role: 'user' as const,
          content: 'Hello',
          timestamp: '2023-01-01T00:00:00.000Z'
        }
      ];

      mockDatabaseService.getChat.mockResolvedValue(mockChat);
      mockDatabaseService.getMessages.mockResolvedValue(mockMessages);

      const { result } = renderHook(() => useChatStore());

      await act(async () => {
        await result.current.loadChat('test-chat-id');
      });

      expect(mockDatabaseService.getChat).toHaveBeenCalledWith('test-chat-id');
      expect(mockDatabaseService.getMessages).toHaveBeenCalledWith('test-chat-id');
      expect(result.current.currentChat).toEqual(mockChat);
      expect(result.current.messages).toEqual(mockMessages);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle loadChat error', async () => {
      const errorMessage = 'Chat not found';
      mockDatabaseService.getChat.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useChatStore());

      await act(async () => {
        await result.current.loadChat('non-existent-chat');
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('addMessage', () => {
    it('should add a message successfully', async () => {
      const mockMessage = {
        id: 'msg-1',
        chatId: 'test-chat-id',
        role: 'user' as const,
        content: 'Hello',
        timestamp: '2023-01-01T00:00:00.000Z'
      };

      mockDatabaseService.addMessage.mockResolvedValue(mockMessage);

      const { result } = renderHook(() => useChatStore());

      // Set current chat first
      act(() => {
        result.current.currentChat = {
          id: 'test-chat-id',
          title: 'Test Chat',
          model: 'test-model',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
          sendFullHistory: true
        };
      });

      await act(async () => {
        await result.current.addMessage('Hello', 'user');
      });

      expect(mockDatabaseService.addMessage).toHaveBeenCalledWith('test-chat-id', 'Hello', 'user');
      expect(result.current.messages).toContain(mockMessage);
    });

    it('should not add message when no current chat', async () => {
      const { result } = renderHook(() => useChatStore());

      // Ensure no current chat
      act(() => {
        result.current.currentChat = null;
      });

      await act(async () => {
        await result.current.addMessage('Hello', 'user');
      });

      expect(mockDatabaseService.addMessage).not.toHaveBeenCalled();
    });
  });

  describe('deleteChat', () => {
    it('should delete a chat successfully', async () => {
      const chatId = 'test-chat-id';
      mockDatabaseService.deleteChat.mockResolvedValue(undefined);

      const { result } = renderHook(() => useChatStore());

      // Set up initial state
      act(() => {
        result.current.chats = [
          {
            id: chatId,
            title: 'Test Chat',
            model: 'test-model',
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
            sendFullHistory: true
          }
        ];
        result.current.currentChat = result.current.chats[0];
      });

      await act(async () => {
        await result.current.deleteChat(chatId);
      });

      expect(mockDatabaseService.deleteChat).toHaveBeenCalledWith(chatId);
      expect(result.current.chats).toHaveLength(0);
      expect(result.current.currentChat).toBe(null);
    });
  });

  describe('loadChats', () => {
    it('should load chats successfully', async () => {
      const mockChats = [
        {
          id: 'chat-1',
          title: 'Chat 1',
          model: 'test-model',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
          sendFullHistory: true
        }
      ];

      mockDatabaseService.getChats.mockResolvedValue(mockChats);

      const { result } = renderHook(() => useChatStore());

      await act(async () => {
        await result.current.loadChats();
      });

      expect(mockDatabaseService.getChats).toHaveBeenCalled();
      expect(result.current.chats).toEqual(mockChats);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle loadChats error', async () => {
      const errorMessage = 'Failed to load chats';
      mockDatabaseService.getChats.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useChatStore());

      await act(async () => {
        await result.current.loadChats();
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.isLoading).toBe(false);
    });
  });
}); 