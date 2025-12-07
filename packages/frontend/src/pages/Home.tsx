import { useState, useEffect } from 'react';
import { Button, Card, CardBody, Typography, Input } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { mtProps } from '../utils/materialTailwind';
import { useStore } from '../store';
import HistoryList from '../components/HistoryList';

const ipSchema = z.string().ip({ version: 'v4' });

function Home() {
  const [ipAddress, setIpAddress] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { history, loadHistory } = useStore();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleCheck = () => {
    const result = ipSchema.safeParse(ipAddress.trim());

    if (!result.success) {
      setError('Please enter a valid IPv4 address');
      return;
    }

    setError('');
    navigate(`/check/${encodeURIComponent(ipAddress)}`);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-100"
      data-testid="home-page"
    >
      <Card className="w-96" {...mtProps}>
        <CardBody className="flex flex-col items-center gap-4" {...mtProps}>
          <Typography variant="h3" color="blue-gray" {...mtProps} data-testid="home-title">
            IP Address Checker
          </Typography>
          <div className="w-full">
            <Input
              label="IP Address"
              value={ipAddress}
              onChange={e => {
                setIpAddress(e.target.value);
                setError('');
              }}
              onKeyPress={e => e.key === 'Enter' && handleCheck()}
              error={!!error}
              crossOrigin={undefined}
              data-testid="ip-input"
              {...mtProps}
            />
            {error && (
              <Typography
                variant="small"
                color="red"
                className="mt-2"
                {...mtProps}
                data-testid="error-message"
              >
                {error}
              </Typography>
            )}
          </div>
          <Button
            onClick={handleCheck}
            color="blue"
            fullWidth
            disabled={!ipAddress.trim()}
            {...mtProps}
            data-testid="check-button"
          >
            Check
          </Button>

          <HistoryList history={history} />
        </CardBody>
      </Card>
    </div>
  );
}

export default Home;
