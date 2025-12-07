import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

vi.mock('../store', () => ({
  useStore: () => ({
    history: [],
    loadHistory: vi.fn(),
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {component}
    </BrowserRouter>
  );
};

describe('Home', () => {
  it('renders home page', () => {
    renderWithRouter(<Home />);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('renders title', () => {
    renderWithRouter(<Home />);
    expect(screen.getByTestId('home-title')).toBeInTheDocument();
  });

  it('renders IP address input field', () => {
    renderWithRouter(<Home />);
    expect(screen.getByTestId('ip-input')).toBeInTheDocument();
  });

  it('renders check button', () => {
    renderWithRouter(<Home />);
    expect(screen.getByTestId('check-button')).toBeInTheDocument();
  });

  it('check button is disabled when input is empty', () => {
    renderWithRouter(<Home />);
    const button = screen.getByTestId('check-button');
    expect(button).toBeDisabled();
  });

  it('check button is enabled when input has value', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Home />);

    const input = screen.getByTestId('ip-input');
    await user.type(input, '192.168.1.1');

    const button = screen.getByTestId('check-button');
    expect(button).not.toBeDisabled();
  });

  it('shows error for invalid IP address', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Home />);

    const input = screen.getByTestId('ip-input');
    await user.type(input, 'invalid-ip');

    const button = screen.getByTestId('check-button');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
  });

  it('does not show error for valid IP address', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Home />);

    const input = screen.getByTestId('ip-input');
    await user.type(input, '192.168.1.1');

    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
  });
});
