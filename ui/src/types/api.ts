import { Model } from './model';

export interface ChatRequest {
  model: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  stream?: boolean;
  options?: Record<string, any>;
}

export interface ChatResponse {
  model: string;
  created_at: string;
  message: {
    role: 'assistant';
    content: string;
  };
  done: boolean;
  total_duration: number;
  load_duration: number;
  prompt_eval_duration: number;
  eval_duration: number;
}

export interface TagsResponse {
  models: Model[];
}

export interface HealthResponse {
  status: string;
  models: string[];
}

export type { Model }; 