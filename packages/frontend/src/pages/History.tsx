import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardBody, Typography, Button, Alert } from '@material-tailwind/react';
import { mtProps } from '../utils/materialTailwind';
import { getHistoryItem, HistoryItem } from '../utils/history';
import ResultDisplay from '../components/ResultDisplay';

function History() {
  const { ip } = useParams<{ ip: string }>();
  const [historyItem, setHistoryItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    if (ip) {
      const item = getHistoryItem(ip);
      setHistoryItem(item);
    }
  }, [ip]);

  if (!ip) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <Card className="w-full max-w-3xl" {...mtProps}>
          <CardBody className="flex flex-col gap-4" {...mtProps}>
            <Alert color="red" {...mtProps}>
              No IP address provided
            </Alert>
            <div className="flex justify-center">
              <Link to="/">
                <Button variant="outlined" color="blue" {...mtProps}>
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!historyItem) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <Card className="w-full max-w-3xl" {...mtProps}>
          <CardBody className="flex flex-col gap-4" {...mtProps}>
            <Typography variant="h3" color="blue-gray" className="text-center" {...mtProps}>
              History Not Found
            </Typography>
            <Alert color="amber" {...mtProps}>
              No history found for IP: {ip}
            </Alert>
            <div className="flex justify-center">
              <Link to="/">
                <Button variant="outlined" color="blue" {...mtProps}>
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-3xl" {...mtProps}>
        <CardBody className="flex flex-col gap-4" {...mtProps}>
          <Typography variant="h3" color="blue-gray" className="text-center" {...mtProps}>
            IP Check History
          </Typography>

          <ResultDisplay result={historyItem} showTimestamp timestamp={historyItem.timestamp} />

          <div className="flex justify-center">
            <Link to="/">
              <Button variant="outlined" color="blue" {...mtProps}>
                Back to Home
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default History;
