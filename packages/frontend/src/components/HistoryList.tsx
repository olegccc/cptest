import { Typography } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';
import { mtProps } from '../utils/materialTailwind';
import { HistoryItem } from '../utils/history';

interface HistoryListProps {
  history: HistoryItem[];
}

function HistoryList({ history }: HistoryListProps) {
  const navigate = useNavigate();

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-6" data-testid="history-list">
      <Typography
        variant="h6"
        color="blue-gray"
        className="mb-2"
        {...mtProps}
        data-testid="history-title"
      >
        Recent Searches
      </Typography>
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="border-b border-blue-gray-100 bg-blue-gray-50">
              <th className="p-3">
                <Typography variant="small" color="blue-gray" className="font-bold" {...mtProps}>
                  IP Address
                </Typography>
              </th>
              <th className="p-3">
                <Typography variant="small" color="blue-gray" className="font-bold" {...mtProps}>
                  Risk Level
                </Typography>
              </th>
              <th className="p-3">
                <Typography variant="small" color="blue-gray" className="font-bold" {...mtProps}>
                  Date
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {history.map(item => (
              <tr
                key={item.ipAddress}
                className="border-b border-blue-gray-50 hover:bg-blue-gray-50 cursor-pointer"
                onClick={() => navigate(`/history/${item.ipAddress}`)}
              >
                <td className="p-3">
                  <Typography variant="small" color="blue-gray" {...mtProps}>
                    {item.ipAddress}
                  </Typography>
                </td>
                <td className="p-3">
                  <Typography variant="small" color="blue-gray" {...mtProps}>
                    {item.riskLevel}
                  </Typography>
                </td>
                <td className="p-3">
                  <Typography variant="small" color="blue-gray" {...mtProps}>
                    {new Date(item.timestamp).toLocaleDateString()}
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HistoryList;
