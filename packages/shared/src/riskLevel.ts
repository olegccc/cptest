export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface RiskInput {
  abuseScore: number;
  threatScore: number;
  vpnProxyDetected: boolean;
  recentReports: number;
}

export function calculateRiskLevel(data: RiskInput): RiskLevel {
  let riskScore = 0;

  if (data.abuseScore > 75) riskScore += 3;
  else if (data.abuseScore > 25) riskScore += 2;
  else if (data.abuseScore > 0) riskScore += 1;

  if (data.threatScore > 75) riskScore += 3;
  else if (data.threatScore > 50) riskScore += 2;
  else if (data.threatScore > 25) riskScore += 1;

  if (data.vpnProxyDetected) riskScore += 2;

  if (data.recentReports > 50) riskScore += 2;
  else if (data.recentReports > 10) riskScore += 1;

  if (riskScore >= 6) return 'High';
  if (riskScore >= 3) return 'Medium';
  return 'Low';
}
