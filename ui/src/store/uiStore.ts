import { create } from 'zustand';

interface UIStore {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  isGenerating: boolean;
  
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setGenerating: (generating: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  theme: 'light',
  sidebarOpen: true,
  isGenerating: false,

  setTheme: (theme: 'light' | 'dark') => set({ theme }),
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  setGenerating: (generating: boolean) => set({ isGenerating: generating })
})); 