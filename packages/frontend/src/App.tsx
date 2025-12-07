import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Check from './pages/Check';
import History from './pages/History';

export const App = () => {
  return (
    <div data-testid="app">
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/check/:ip" element={<Check />} />
          <Route path="/history/:ip" element={<History />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
