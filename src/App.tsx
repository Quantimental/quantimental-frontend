/**
 * Quantimental App — Main Entry Point
 *
 * Router, providers, and layout structure.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { SignalFeed } from '@/components/Feed/SignalFeed';
import './styles/index.css';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 30000, // 30 seconds
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-dark-bg text-white">
          {/* Navigation */}
          <nav className="border-b border-dark-border bg-dark-card/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <h1 className="text-2xl font-bold gradient-text">
                    Quantimental
                  </h1>

                  <div className="flex gap-4">
                    <NavLink to="/">Feed</NavLink>
                    <NavLink to="/watchlist">Watchlist</NavLink>
                    <NavLink to="/search">Search</NavLink>
                  </div>
                </div>

                <button className="btn-primary text-sm">
                  Upgrade to Premium
                </button>
              </div>
            </div>
          </nav>

          {/* Routes */}
          <Routes>
            <Route path="/" element={<SignalFeed />} />
            <Route path="/stock/:ticker" element={<div className="p-8 text-center text-gray-400">Stock Detail (Coming Soon)</div>} />
            <Route path="/watchlist" element={<div className="p-8 text-center text-gray-400">Watchlist (Coming Soon)</div>} />
            <Route path="/search" element={<div className="p-8 text-center text-gray-400">Search (Coming Soon)</div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Footer */}
          <footer className="border-t border-dark-border mt-16">
            <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500">
              <p className="mb-2">
                <span className="gradient-text font-semibold">Quantimental</span> —
                Market signals that make sense to humans
              </p>
              <p className="text-sm">
                Quant + Psych = Clarity. Built for retail investors.
              </p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <a
      href={to}
      className="text-gray-400 hover:text-white transition-colors font-medium"
    >
      {children}
    </a>
  );
}

export default App;
