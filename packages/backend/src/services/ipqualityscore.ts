const BASE_URL = 'https://ipqualityscore.com/api/json/ip';

export interface IPQualityScoreData {
  message: string;
  success: boolean;
  proxy: boolean;
  ISP: string;
  organization: string;
  ASN: number;
  host: string;
  country_code: string;
  city: string;
  region: string;
  is_crawler: boolean;
  connection_type: string;
  latitude: number;
  longitude: number;
  zip_code: string;
  timezone: string;
  vpn: boolean;
  tor: boolean;
  active_vpn: boolean;
  active_tor: boolean;
  recent_abuse: boolean;
  frequent_abuser: boolean;
  high_risk_attacks: boolean;
  abuse_velocity: string;
  bot_status: boolean;
  shared_connection: boolean;
  dynamic_connection: boolean;
  security_scanner: boolean;
  trusted_network: boolean;
  mobile: boolean;
  fraud_score: number;
  operating_system: string;
  browser: string;
  device_model: string;
  device_brand: string;
  request_id: string;
}

const getApiKey = (): string => {
  const apiKey = process.env.IPQUALITYSCORE_KEY;

  if (!apiKey) {
    throw new Error('IPQUALITYSCORE_KEY environment variable is not set');
  }

  return apiKey;
};

export const createIpQualityScoreService = () => {
  const check = async (ipAddress: string): Promise<IPQualityScoreData> => {
    const apiKey = getApiKey();
    const url = `${BASE_URL}/${apiKey}/${encodeURIComponent(ipAddress)}`;

    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit reached for IPQualityScore, try again later.');
      }
      const error = await response.text();
      throw new Error(`IPQualityScore API error: ${response.status} - ${error}`);
    }

    const data: IPQualityScoreData = await response.json();

    if (!data.success) {
      if (data.message && data.message.toLowerCase().includes('rate limit')) {
        throw new Error('Rate limit reached for IPQualityScore, try again later.');
      }
      throw new Error(`IPQualityScore API error: ${data.message}`);
    }

    return data;
  };

  return { check };
};

export type IpQualityScoreService = ReturnType<typeof createIpQualityScoreService>;
