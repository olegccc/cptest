import { Request, Response } from 'express';
import { z } from 'zod';
import { IntelResponse, calculateRiskLevel } from 'shared';
import { AbuseIpdbService } from '../services/abuseipdb.js';
import { IpQualityScoreService } from '../services/ipqualityscore.js';

const querySchema = z.object({
  ip: z.string().ip({ version: 'v4', message: 'Invalid IP address' }),
});

export const createIntelHandler =
  (abuseIpdbService: AbuseIpdbService, ipQualityScoreService: IpQualityScoreService) =>
  async (req: Request, res: Response) => {
    const validation = querySchema.safeParse(req.query);

    if (!validation.success) {
      const errorMessage = validation.error.errors[0]?.message || 'Invalid request';
      return res.status(400).json({ error: errorMessage });
    }

    const { ip } = validation.data;

    const warnings: string[] = [];
    let abuseData = null;
    let qualityData = null;

    const [abuseResult, qualityResult] = await Promise.allSettled([
      abuseIpdbService.check(ip),
      ipQualityScoreService.check(ip),
    ]);

    if (abuseResult.status === 'fulfilled') {
      abuseData = abuseResult.value;
    } else {
      const errorMsg =
        abuseResult.reason instanceof Error ? abuseResult.reason.message : 'AbuseIPDB check failed';
      warnings.push(`AbuseIPDB: ${errorMsg}`);
    }

    if (qualityResult.status === 'fulfilled') {
      qualityData = qualityResult.value;
    } else {
      const errorMsg =
        qualityResult.reason instanceof Error
          ? qualityResult.reason.message
          : 'IPQualityScore check failed';
      warnings.push(`IPQualityScore: ${errorMsg}`);
    }

    if (!abuseData && !qualityData) {
      return res.status(500).json({ error: 'Both IP intelligence services failed', warnings });
    }

    const abuseScore = abuseData?.abuseConfidenceScore || 0;
    const recentReports = abuseData?.totalReports || 0;
    const vpnProxyDetected = qualityData
      ? qualityData.vpn || qualityData.proxy || qualityData.tor
      : false;
    const threatScore = qualityData?.fraud_score || 0;

    const response: IntelResponse = {
      ipAddress: abuseData?.ipAddress || ip,
      hostname: abuseData?.hostnames?.[0] || qualityData?.host || null,
      isp: abuseData?.isp || 'Unknown',
      country: abuseData?.countryCode || 'Unknown',
      abuseScore,
      recentReports,
      vpnProxyDetected,
      threatScore,
      riskLevel: calculateRiskLevel({ abuseScore, recentReports, vpnProxyDetected, threatScore }),
    };

    if (warnings.length > 0) {
      response.warnings = warnings;
    }

    res.json(response);
  };
