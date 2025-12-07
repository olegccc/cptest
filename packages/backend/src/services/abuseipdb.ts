const BASE_URL = 'https://api.abuseipdb.com/api/v2';

export interface AbuseIPDBData {
  ipAddress: string;
  isPublic: boolean;
  ipVersion: number;
  isWhitelisted: boolean;
  abuseConfidenceScore: number;
  countryCode: string;
  usageType: string;
  isp: string;
  domain: string;
  hostnames: string[];
  totalReports: number;
  numDistinctUsers: number;
  lastReportedAt: string | null;
}

interface AbuseIPDBResponse {
  data: AbuseIPDBData;
}

const getApiKey = (): string => {
  const apiKey = process.env.ABUSEIPDB_KEY;

  if (!apiKey) {
    throw new Error('ABUSEIPDB_KEY environment variable is not set');
  }

  return apiKey;
};

export const createAbuseIpdbService = () => {
  const check = async (ipAddress: string, maxAgeInDays: number = 90): Promise<AbuseIPDBData> => {
    const apiKey = getApiKey();
    const url = `${BASE_URL}/check?ipAddress=${encodeURIComponent(ipAddress)}&maxAgeInDays=${maxAgeInDays}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Key: apiKey,
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit reached for AbuseIPDB, try again later.');
      }
      const error = await response.text();
      throw new Error(`AbuseIPDB API error: ${response.status} - ${error}`);
    }

    const result: AbuseIPDBResponse = await response.json();
    return result.data;
  };

  return { check };
};

export type AbuseIpdbService = ReturnType<typeof createAbuseIpdbService>;
