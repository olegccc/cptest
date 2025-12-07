import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HistoryList from './HistoryList';
import { HistoryItem } from '../utils/history';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {component}
    </BrowserRouter>
  );
};

describe('HistoryList', () => {
  it('does not render when history is empty', () => {
    renderWithRouter(<HistoryList history={[]} />);
    expect(screen.queryByTestId('history-list')).not.toBeInTheDocument();
  });

  it('renders history list when history is not empty', () => {
    const mockHistory: HistoryItem[] = [
      {
        ipAddress: '192.168.1.1',
        riskLevel: 'Low',
        timestamp: new Date().getDate(),
        hostname: null,
        isp: '',
        country: '',
        abuseScore: 0,
        recentReports: 0,
        vpnProxyDetected: false,
        threatScore: 0,
      },
    ];

    renderWithRouter(<HistoryList history={mockHistory} />);
    expect(screen.getByTestId('history-list')).toBeInTheDocument();
  });

  it('renders history title when history is not empty', () => {
    const mockHistory: HistoryItem[] = [
      {
        ipAddress: '192.168.1.1',
        riskLevel: 'Low',
        timestamp: new Date().getDate(),
        hostname: null,
        isp: '',
        country: '',
        abuseScore: 0,
        recentReports: 0,
        vpnProxyDetected: false,
        threatScore: 0,
      },
    ];

    renderWithRouter(<HistoryList history={mockHistory} />);
    expect(screen.getByTestId('history-title')).toBeInTheDocument();
  });
});
