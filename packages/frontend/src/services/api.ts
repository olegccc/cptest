import { IntelResponse } from 'shared';

export const fetchIntel = async (ip: string): Promise<IntelResponse> => {
  const response = await fetch(`/api/intel?ip=${encodeURIComponent(ip)}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch data');
  }

  return response.json();
};
