import { IntelResponse } from 'shared';

const HISTORY_KEY = 'ip-check-history';
const MAX_HISTORY_ITEMS = 10;

export interface HistoryItem extends IntelResponse {
  timestamp: number;
}

export function getHistory(): HistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveToHistory(result: IntelResponse): void {
  try {
    let history = getHistory();

    history = history.filter(item => item.ipAddress !== result.ipAddress);

    const newItem: HistoryItem = {
      ...result,
      timestamp: Date.now(),
    };

    history.unshift(newItem);

    if (history.length > MAX_HISTORY_ITEMS) {
      history = history.slice(0, MAX_HISTORY_ITEMS);
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save to history:', error);
  }
}

export function getHistoryItem(ip: string): HistoryItem | null {
  const history = getHistory();
  return history.find(item => item.ipAddress === ip) || null;
}
