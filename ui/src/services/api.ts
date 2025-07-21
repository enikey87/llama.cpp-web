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

  async sendChatStream(
    model: string, 
    messages: Array<{ role: 'user' | 'assistant'; content: string }>, 
    options = {},
    onChunk?: (chunk: string) => void,
    onComplete?: (response: any) => void,
    onError?: (error: string) => void
  ): Promise<void> {
    // Convert messages to prompt format for /generate/stream endpoint
    let prompt = "";
    for (const message of messages) {
      if (message.role === "user") {
        prompt += `User: ${message.content}\n`;
      } else if (message.role === "assistant") {
        prompt += `Assistant: ${message.content}\n`;
      }
    }
    prompt += "Assistant: ";

    try {
      const response = await fetch(`${API_BASE}/generate/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt,
          stream: true,
          options
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send chat message: ${errorText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.done) {
                if (onComplete) {
                  // Convert generate response to chat response format
                  onComplete({
                    model: data.model,
                    created_at: data.created_at,
                    message: {
                      role: 'assistant',
                      content: data.response
                    },
                    done: true,
                    total_duration: data.total_duration
                  });
                }
              } else if (data.response && onChunk) {
                onChunk(data.response);
              }
            } catch (e) {
              console.error('Error parsing streaming data:', e);
            }
          }
        }
      }
    } catch (error) {
      if (onError) {
        onError(error instanceof Error ? error.message : 'Streaming failed');
      } else {
        throw error;
      }
    }
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