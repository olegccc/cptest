import { RiskLevel } from './riskLevel.js';

export interface IntelResponse {
  ipAddress: string;
  hostname: string | null;
  isp: string;
  country: string;
  abuseScore: number;
  recentReports: number;
  vpnProxyDetected: boolean;
  threatScore: number;
  riskLevel: RiskLevel;
  warnings?: string[];
}
