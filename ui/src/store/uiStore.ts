import { create } from 'zustand';

interface UIStore {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  isGenerating: boolean;
  sendFullHistory: boolean; // New setting to control chat history sending
  
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setGenerating: (generating: boolean) => void;
  setSendFullHistory: (sendFullHistory: boolean) => void; // New action
}

export const useUIStore = create<UIStore>((set) => ({
  theme: 'light',
  sidebarOpen: true,
  isGenerating: false,
  sendFullHistory: true, // Default to sending full history

  setTheme: (theme: 'light' | 'dark') => set({ theme }),
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  setGenerating: (generating: boolean) => set({ isGenerating: generating }),
  setSendFullHistory: (sendFullHistory: boolean) => set({ sendFullHistory })
})); 