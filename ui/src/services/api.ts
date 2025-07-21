import { Model, ChatRequest, ChatResponse, TagsResponse, HealthResponse } from '../types/api';

const API_BASE = 'http://localhost:11434/api';

export class ApiService {
  async getModels(): Promise<Model[]> {
    const response = await fetch(`${API_BASE}/tags`);
    if (!response.ok) throw new Error('Failed to fetch models');
    const data: TagsResponse = await response.json();
    return data.models;
  }

  async sendChat(model: string, messages: Array<{ role: 'user' | 'assistant'; content: string }>, options = {}): Promise<ChatResponse> {
    const request: ChatRequest = {
      model,
      messages,
      stream: false,
      options
    };

    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    
    if (!response.ok) throw new Error('Failed to send chat message');
    return response.json();
  }

  async sendSingleMessage(model: string, message: string, options = {}): Promise<ChatResponse> {
    const request: ChatRequest = {
      model,
      messages: [{ role: 'user', content: message }],
      stream: false,
      options
    };

    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    
    if (!response.ok) throw new Error('Failed to send chat message');
    return response.json();
  }

  async healthCheck(): Promise<HealthResponse> {
    const response = await fetch(`${API_BASE}/health`);
    if (!response.ok) throw new Error('Health check failed');
    return response.json();
  }
}

export const apiService = new ApiService(); 