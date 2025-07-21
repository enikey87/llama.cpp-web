import { apiService } from '../services/api';
import { ERROR_MESSAGES } from '../constants';

// Mock fetch globally
global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('ApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getModels', () => {
    it('should fetch models successfully', async () => {
      const mockModels = [
        { name: 'model1', size: 1000, modifiedAt: '2023-01-01', digest: 'abc123' },
        { name: 'model2', size: 2000, modifiedAt: '2023-01-02', digest: 'def456' }
      ];

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ models: mockModels })
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await apiService.getModels();

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:11434/api/tags');
      expect(result).toEqual(mockModels);
    });

    it('should handle getModels error', async () => {
      const mockResponse = {
        ok: false,
        text: jest.fn().mockResolvedValue('Server error')
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(apiService.getModels()).rejects.toThrow('Failed to fetch models: Server error');
    });
  });

  describe('sendChat', () => {
    it('should send chat message successfully', async () => {
      const mockResponse = {
        model: 'test-model',
        created_at: '2023-01-01T00:00:00.000Z',
        message: { role: 'assistant' as const, content: 'Hello!' },
        done: true,
        total_duration: 1000,
        load_duration: 100,
        prompt_eval_duration: 500,
        eval_duration: 400
      };

      const mockFetchResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse)
      };

      mockFetch.mockResolvedValue(mockFetchResponse as any);

      const result = await apiService.sendChat('test-model', [
        { role: 'user', content: 'Hello' }
      ]);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'test-model',
          messages: [{ role: 'user', content: 'Hello' }],
          stream: false,
          options: {}
        })
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle 404 error', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        text: jest.fn().mockResolvedValue('Model not found')
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(apiService.sendChat('non-existent-model', [
        { role: 'user', content: 'Hello' }
      ])).rejects.toThrow(ERROR_MESSAGES.MODEL_NOT_FOUND);
    });

    it('should handle 500 error', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        text: jest.fn().mockResolvedValue('Internal server error')
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(apiService.sendChat('test-model', [
        { role: 'user', content: 'Hello' }
      ])).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR);
    });

    it('should handle 413 error', async () => {
      const mockResponse = {
        ok: false,
        status: 413,
        text: jest.fn().mockResolvedValue('Request entity too large')
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(apiService.sendChat('test-model', [
        { role: 'user', content: 'Hello' }
      ])).rejects.toThrow(ERROR_MESSAGES.MESSAGE_TOO_LONG);
    });
  });

  describe('sendChatStream', () => {
    it('should handle streaming error', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        text: jest.fn().mockResolvedValue('Model not found')
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const onChunk = jest.fn();
      const onComplete = jest.fn();
      const onError = jest.fn();

      await apiService.sendChatStream(
        'non-existent-model',
        [{ role: 'user', content: 'Hello' }],
        {},
        onChunk,
        onComplete,
        onError
      );

      expect(onError).toHaveBeenCalledWith(ERROR_MESSAGES.MODEL_NOT_FOUND);
      expect(onChunk).not.toHaveBeenCalled();
      expect(onComplete).not.toHaveBeenCalled();
    });
  });

  describe('healthCheck', () => {
    it('should perform health check successfully', async () => {
      const mockHealthResponse = {
        status: 'ok',
        models: ['model1', 'model2']
      };

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockHealthResponse)
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await apiService.healthCheck();

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:11434/api/health');
      expect(result).toEqual(mockHealthResponse);
    });

    it('should handle health check error', async () => {
      const mockResponse = {
        ok: false,
        text: jest.fn().mockResolvedValue('Service unavailable')
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(apiService.healthCheck()).rejects.toThrow('Health check failed: Service unavailable');
    });
  });
}); 