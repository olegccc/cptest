import { create } from 'zustand';
import { IntelResponse } from 'shared';
import { getHistory, saveToHistory, HistoryItem } from './utils/history';

interface StoreState {
  isLoading: boolean;
  result: IntelResponse | null;
  error: string | null;
  history: HistoryItem[];
  setLoading: (loading: boolean) => void;
  setResult: (result: IntelResponse) => void;
  setError: (error: string) => void;
  reset: () => void;
  loadHistory: () => void;
}

export const useStore = create<StoreState>(set => ({
  isLoading: false,
  result: null,
  error: null,
  history: getHistory(),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setResult: (result: IntelResponse) => {
    saveToHistory(result);
    set({ result, isLoading: false, error: null, history: getHistory() });
  },
  setError: (error: string) => set({ error, isLoading: false }),
  reset: () => set({ isLoading: false, result: null, error: null }),
  loadHistory: () => set({ history: getHistory() }),
}));
