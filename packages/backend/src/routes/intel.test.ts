import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { createIntelHandler } from './intel.js';
import { AbuseIpdbService } from '../services/abuseipdb.js';
import { IpQualityScoreService } from '../services/ipqualityscore.js';
import { AbuseIPDBData } from '../services/abuseipdb.js';
import { IPQualityScoreData } from '../services/ipqualityscore.js';

vi.mock('shared', async () => {
  const actual = await vi.importActual('shared');
  return {
    ...actual,
    calculateRiskLevel: vi.fn(),
  };
});

import { calculateRiskLevel } from 'shared';

const createMockRequest = (query: Record<string, any>): Partial<Request> => ({
  query,
});

const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return res;
};

const mockAbuseData: AbuseIPDBData = {
  ipAddress: '8.8.8.8',
  isPublic: true,
  ipVersion: 4,
  isWhitelisted: false,
  abuseConfidenceScore: 0,
  countryCode: 'US',
  usageType: 'Data Center/Web Hosting/Transit',
  isp: 'Google LLC',
  domain: 'google.com',
  hostnames: ['dns.google'],
  totalReports: 0,
  numDistinctUsers: 0,
  lastReportedAt: null,
};

const mockQualityData: IPQualityScoreData = {
  message: 'Success',
  success: true,
  proxy: false,
  ISP: 'Google LLC',
  organization: 'Google LLC',
  ASN: 15169,
  host: 'dns.google',
  country_code: 'US',
  city: 'Mountain View',
  region: 'California',
  is_crawler: false,
  connection_type: 'Corporate',
  latitude: 37.419200897217,
  longitude: -122.05740356445,
  zip_code: '94043',
  timezone: 'America/Los_Angeles',
  vpn: false,
  tor: false,
  active_vpn: false,
  active_tor: false,
  recent_abuse: false,
  frequent_abuser: false,
  high_risk_attacks: false,
  abuse_velocity: 'none',
  bot_status: false,
  shared_connection: false,
  dynamic_connection: false,
  security_scanner: false,
  trusted_network: true,
  mobile: false,
  fraud_score: 0,
  operating_system: 'N/A',
  browser: 'N/A',
  device_model: 'N/A',
  device_brand: 'N/A',
  request_id: 'test-request-id',
};

describe('intel handler', () => {
  beforeEach(() => {
    vi.mocked(calculateRiskLevel).mockReturnValue('Low');
  });

  describe('IP address validation', () => {
    it('should reject missing IP address', async () => {
      const mockAbuseService: AbuseIpdbService = { check: vi.fn() };
      const mockQualityService: IpQualityScoreService = { check: vi.fn() };
      const handler = createIntelHandler(mockAbuseService, mockQualityService);

      const req = createMockRequest({});
      const res = createMockResponse();

      await handler(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Required' });
    });

    it('should reject invalid IP address format', async () => {
      const mockAbuseService: AbuseIpdbService = { check: vi.fn() };
      const mockQualityService: IpQualityScoreService = { check: vi.fn() };
      const handler = createIntelHandler(mockAbuseService, mockQualityService);

      const req = createMockRequest({ ip: 'invalid-ip' });
      const res = createMockResponse();

      await handler(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid IP address' });
    });

    it('should reject IPv6 addresses', async () => {
      const mockAbuseService: AbuseIpdbService = { check: vi.fn() };
      const mockQualityService: IpQualityScoreService = { check: vi.fn() };
      const handler = createIntelHandler(mockAbuseService, mockQualityService);

      const req = createMockRequest({ ip: '2001:0db8:85a3:0000:0000:8a2e:0370:7334' });
      const res = createMockResponse();

      await handler(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid IP address' });
    });

    it('should accept valid IPv4 address', async () => {
      const mockAbuseService: AbuseIpdbService = {
        check: vi.fn().mockResolvedValue(mockAbuseData),
      };
      const mockQualityService: IpQualityScoreService = {
        check: vi.fn().mockResolvedValue(mockQualityData),
      };
      const handler = createIntelHandler(mockAbuseService, mockQualityService);

      const req = createMockRequest({ ip: '8.8.8.8' });
      const res = createMockResponse();

      await handler(req as Request, res as Response);

      expect(mockAbuseService.check).toHaveBeenCalledWith('8.8.8.8');
      expect(mockQualityService.check).toHaveBeenCalledWith('8.8.8.8');
      expect(res.status).not.toHaveBeenCalledWith(400);
    });
  });

  describe('data aggregation', () => {
    it('should aggregate data from both services successfully', async () => {
      const mockAbuseService: AbuseIpdbService = {
        check: vi.fn().mockResolvedValue(mockAbuseData),
      };
      const mockQualityService: IpQualityScoreService = {
        check: vi.fn().mockResolvedValue(mockQualityData),
      };
      const handler = createIntelHandler(mockAbuseService, mockQualityService);

      const req = createMockRequest({ ip: '8.8.8.8' });
      const res = createMockResponse();

      await handler(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith({
        ipAddress: '8.8.8.8',
        hostname: 'dns.google',
        isp: 'Google LLC',
        country: 'US',
        abuseScore: 0,
        recentReports: 0,
        vpnProxyDetected: false,
        threatScore: 0,
        riskLevel: 'Low',
      });
    });

    it('should detect VPN/Proxy/Tor from quality data', async () => {
      vi.mocked(calculateRiskLevel).mockReturnValue('Medium');

      const mockAbuseService: AbuseIpdbService = {
        check: vi.fn().mockResolvedValue(mockAbuseData),
      };
      const mockQualityService: IpQualityScoreService = {
        check: vi.fn().mockResolvedValue({ ...mockQualityData, vpn: true }),
      };
      const handler = createIntelHandler(mockAbuseService, mockQualityService);

      const req = createMockRequest({ ip: '8.8.8.8' });
      const res = createMockResponse();

      await handler(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          vpnProxyDetected: true,
          riskLevel: 'Medium',
        })
      );
      expect(calculateRiskLevel).toHaveBeenCalledWith({
        abuseScore: 0,
        recentReports: 0,
        vpnProxyDetected: true,
        threatScore: 0,
      });
    });

    it('should calculate correct risk level with high abuse score', async () => {
      vi.mocked(calculateRiskLevel).mockReturnValue('High');

      const mockAbuseService: AbuseIpdbService = {
        check: vi.fn().mockResolvedValue({
          ...mockAbuseData,
          abuseConfidenceScore: 85,
          totalReports: 60,
        }),
      };
      const mockQualityService: IpQualityScoreService = {
        check: vi.fn().mockResolvedValue({ ...mockQualityData, fraud_score: 80 }),
      };
      const handler = createIntelHandler(mockAbuseService, mockQualityService);

      const req = createMockRequest({ ip: '8.8.8.8' });
      const res = createMockResponse();

      await handler(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          abuseScore: 85,
          recentReports: 60,
          threatScore: 80,
          riskLevel: 'High',
        })
      );
      expect(calculateRiskLevel).toHaveBeenCalledWith({
        abuseScore: 85,
        recentReports: 60,
        vpnProxyDetected: false,
        threatScore: 80,
      });
    });

    it('should handle failure from abuse service gracefully', async () => {
      const mockAbuseService: AbuseIpdbService = {
        check: vi.fn().mockRejectedValue(new Error('Rate limit reached')),
      };
      const mockQualityService: IpQualityScoreService = {
        check: vi.fn().mockResolvedValue(mockQualityData),
      };
      const handler = createIntelHandler(mockAbuseService, mockQualityService);

      const req = createMockRequest({ ip: '8.8.8.8' });
      const res = createMockResponse();

      await handler(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          ipAddress: '8.8.8.8',
          hostname: 'dns.google',
          isp: 'Unknown',
          abuseScore: 0,
          recentReports: 0,
          warnings: ['AbuseIPDB: Rate limit reached'],
        })
      );
    });

    it('should handle failure from quality service gracefully', async () => {
      const mockAbuseService: AbuseIpdbService = {
        check: vi.fn().mockResolvedValue(mockAbuseData),
      };
      const mockQualityService: IpQualityScoreService = {
        check: vi.fn().mockRejectedValue(new Error('API error')),
      };
      const handler = createIntelHandler(mockAbuseService, mockQualityService);

      const req = createMockRequest({ ip: '8.8.8.8' });
      const res = createMockResponse();

      await handler(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          ipAddress: '8.8.8.8',
          hostname: 'dns.google',
          isp: 'Google LLC',
          vpnProxyDetected: false,
          threatScore: 0,
          warnings: ['IPQualityScore: API error'],
        })
      );
    });

    it('should return 500 when both services fail', async () => {
      const mockAbuseService: AbuseIpdbService = {
        check: vi.fn().mockRejectedValue(new Error('Service down')),
      };
      const mockQualityService: IpQualityScoreService = {
        check: vi.fn().mockRejectedValue(new Error('Service down')),
      };
      const handler = createIntelHandler(mockAbuseService, mockQualityService);

      const req = createMockRequest({ ip: '8.8.8.8' });
      const res = createMockResponse();

      await handler(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Both IP intelligence services failed',
        warnings: ['AbuseIPDB: Service down', 'IPQualityScore: Service down'],
      });
    });

    it('should prefer abuse data for hostname and fallback to quality data', async () => {
      const mockAbuseService: AbuseIpdbService = {
        check: vi.fn().mockResolvedValue({ ...mockAbuseData, hostnames: [] }),
      };
      const mockQualityService: IpQualityScoreService = {
        check: vi.fn().mockResolvedValue(mockQualityData),
      };
      const handler = createIntelHandler(mockAbuseService, mockQualityService);

      const req = createMockRequest({ ip: '8.8.8.8' });
      const res = createMockResponse();

      await handler(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          hostname: 'dns.google',
        })
      );
    });

    it('should use IP address when both services fail to provide hostname', async () => {
      const mockAbuseService: AbuseIpdbService = {
        check: vi.fn().mockRejectedValue(new Error('Failed')),
      };
      const mockQualityService: IpQualityScoreService = {
        check: vi.fn().mockResolvedValue({ ...mockQualityData, host: '' }),
      };
      const handler = createIntelHandler(mockAbuseService, mockQualityService);

      const req = createMockRequest({ ip: '8.8.8.8' });
      const res = createMockResponse();

      await handler(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          hostname: null,
          ipAddress: '8.8.8.8',
        })
      );
    });
  });
});
