import { Alert, Chip, Typography } from '@material-tailwind/react';
import { IntelResponse, RiskLevel } from 'shared';
import { mtProps } from '../utils/materialTailwind';

interface ResultDisplayProps {
  result: IntelResponse;
  showTimestamp?: boolean;
  timestamp?: number;
}

function getRiskColor(level: RiskLevel): 'green' | 'amber' | 'red' {
  if (level === 'Low') return 'green';
  if (level === 'Medium') return 'amber';
  return 'red';
}

function getRiskIcon(level: RiskLevel): string {
  if (level === 'Low') return '✓';
  if (level === 'Medium') return '⚠';
  return '✕';
}

function ResultDisplay({ result, showTimestamp, timestamp }: ResultDisplayProps) {
  return (
    <div className="flex flex-col gap-4">
      {showTimestamp && timestamp && (
        <div className="flex justify-end">
          <Typography variant="small" color="gray" {...mtProps}>
            {new Date(timestamp).toLocaleString()}
          </Typography>
        </div>
      )}

      {result.warnings && result.warnings.length > 0 && (
        <Alert color="amber" {...mtProps}>
          <div className="font-semibold">Warnings:</div>
          <ul className="list-disc pl-5 mt-1">
            {result.warnings.map((warning, idx) => (
              <li key={idx}>{warning}</li>
            ))}
          </ul>
        </Alert>
      )}

      <div className="flex justify-center mb-2">
        <div className="text-center">
          <Typography variant="h6" color="blue-gray" className="mb-2" {...mtProps}>
            Overall Risk Level
          </Typography>
          <Chip
            value={`${getRiskIcon(result.riskLevel)} ${result.riskLevel}`}
            color={getRiskColor(result.riskLevel)}
            size="lg"
            className="text-lg font-bold px-6 py-3"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-bold leading-none"
                  {...mtProps}
                >
                  Property
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-bold leading-none"
                  {...mtProps}
                >
                  Value
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-4 border-b border-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-semibold"
                  {...mtProps}
                >
                  IP Address
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <Typography variant="small" color="blue-gray" {...mtProps}>
                  {result.ipAddress}
                </Typography>
              </td>
            </tr>
            <tr>
              <td className="p-4 border-b border-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-semibold"
                  {...mtProps}
                >
                  Hostname
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <Typography variant="small" color="blue-gray" {...mtProps}>
                  {result.hostname || 'N/A'}
                </Typography>
              </td>
            </tr>
            <tr>
              <td className="p-4 border-b border-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-semibold"
                  {...mtProps}
                >
                  ISP
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <Typography variant="small" color="blue-gray" {...mtProps}>
                  {result.isp}
                </Typography>
              </td>
            </tr>
            <tr>
              <td className="p-4 border-b border-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-semibold"
                  {...mtProps}
                >
                  Country
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <Typography variant="small" color="blue-gray" {...mtProps}>
                  {result.country}
                </Typography>
              </td>
            </tr>
            <tr>
              <td className="p-4 border-b border-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-semibold"
                  {...mtProps}
                >
                  Abuse Score
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <Typography variant="small" color="blue-gray" {...mtProps}>
                  {result.abuseScore}
                </Typography>
              </td>
            </tr>
            <tr>
              <td className="p-4 border-b border-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-semibold"
                  {...mtProps}
                >
                  Recent Reports
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <Typography variant="small" color="blue-gray" {...mtProps}>
                  {result.recentReports}
                </Typography>
              </td>
            </tr>
            <tr>
              <td className="p-4 border-b border-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-semibold"
                  {...mtProps}
                >
                  VPN/Proxy Detected
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <Typography variant="small" color="blue-gray" {...mtProps}>
                  {result.vpnProxyDetected ? 'Yes' : 'No'}
                </Typography>
              </td>
            </tr>
            <tr>
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-semibold"
                  {...mtProps}
                >
                  Threat Score
                </Typography>
              </td>
              <td className="p-4">
                <Typography variant="small" color="blue-gray" {...mtProps}>
                  {result.threatScore}
                </Typography>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ResultDisplay;
