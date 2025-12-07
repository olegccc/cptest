import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardBody, Typography, Button, Spinner, Alert } from '@material-tailwind/react';
import { useStore } from '../store';
import { mtProps } from '../utils/materialTailwind';
import ResultDisplay from '../components/ResultDisplay';
import { fetchIntel } from '../services/api';

function Check() {
  const { ip } = useParams<{ ip: string }>();
  const { isLoading, result, error, setLoading, setResult, setError, reset } = useStore();

  useEffect(() => {
    reset();

    if (!ip) {
      setError('No IP address provided');
      return;
    }

    const loadIntel = async () => {
      setLoading(true);

      try {
        const data = await fetchIntel(ip);
        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    loadIntel().catch(console.error);
  }, [ip, setLoading, setResult, setError, reset]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-3xl" {...mtProps}>
        <CardBody className="flex flex-col gap-4" {...mtProps}>
          <Typography variant="h3" color="blue-gray" className="text-center" {...mtProps}>
            IP Check Result
          </Typography>

          {isLoading && (
            <div className="flex flex-col items-center gap-2">
              <Spinner className="h-12 w-12" {...mtProps} />
              <Typography variant="paragraph" color="blue-gray" {...mtProps}>
                Loading...
              </Typography>
            </div>
          )}

          {error && (
            <Alert color="red" {...mtProps}>
              Error: {error}
            </Alert>
          )}

          {result && <ResultDisplay result={result} />}

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

export default Check;
