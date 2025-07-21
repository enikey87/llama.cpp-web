import { create } from 'zustand';
import { Model } from '../types/model';
import { apiService } from '../services/api';

interface ModelStore {
  models: Model[];
  selectedModel: string;
  isLoading: boolean;
  error: string | null;
  
  loadModels: () => Promise<void>;
  setSelectedModel: (model: string) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useModelStore = create<ModelStore>((set) => ({
  models: [],
  selectedModel: '',
  isLoading: false,
  error: null,

  loadModels: async () => {
    try {
      set({ isLoading: true, error: null });
      const models = await apiService.getModels();
      set({ 
        models, 
        selectedModel: models[0]?.name || '',
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load models', 
        isLoading: false 
      });
    }
  },

  setSelectedModel: (model: string) => set({ selectedModel: model }),
  setError: (error: string | null) => set({ error }),
  setLoading: (loading: boolean) => set({ isLoading: loading })
})); 