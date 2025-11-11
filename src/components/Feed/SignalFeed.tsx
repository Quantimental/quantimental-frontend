/**
 * Signal Feed — The Home Screen
 *
 * Displays a filterable feed of stock signals.
 * Color-coded, confidence-ranked, real-time intelligence.
 *
 * Philosophy: User should understand the most important signal in < 5 seconds.
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Filter,
  Search,
  TrendingUp,
  Clock,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

import { signalsAPI } from '@/services/api';
import SignalBadge from '@/components/shared/SignalBadge';
import ConfidenceMeter from '@/components/shared/ConfidenceMeter';
import type { SignalFeedItem, SignalType } from '@/types/api';

export function SignalFeed() {
  const [filters, setFilters] = useState({
    signal_type: undefined as SignalType | undefined,
    min_confidence: 0.75,
    page: 1,
  });

  // Fetch signal feed
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['signal-feed', filters],
    queryFn: () => signalsAPI.getFeed(filters),
    refetchInterval: 60000, // Refetch every minute
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header with gradient */}
      <div className="bg-gradient-dark border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                Market Signals
              </h1>
              <p className="text-gray-400">
                Institutional intelligence, human clarity
              </p>
            </div>

            <button
              onClick={() => refetch()}
              className="btn-ghost flex items-center gap-2"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-wrap gap-3">
            <FilterButton
              icon={<Filter size={16} />}
              label="All Signals"
              active={!filters.signal_type}
              onClick={() => handleFilterChange('signal_type', undefined)}
            />
            <FilterButton
              icon={<TrendingUp size={16} />}
              label="Strong Buy"
              active={filters.signal_type === 'STRONG_BUY'}
              onClick={() => handleFilterChange('signal_type', 'STRONG_BUY')}
            />
            <FilterButton
              icon={<TrendingUp size={16} />}
              label="Strong Sell"
              active={filters.signal_type === 'STRONG_SELL'}
              onClick={() => handleFilterChange('signal_type', 'STRONG_SELL')}
            />

            <div className="ml-auto">
              <select
                value={filters.min_confidence}
                onChange={(e) =>
                  handleFilterChange('min_confidence', parseFloat(e.target.value))
                }
                className="input text-sm py-2"
              >
                <option value={0.5}>50%+ Confidence</option>
                <option value={0.7}>70%+ Confidence</option>
                <option value={0.75}>75%+ Confidence</option>
                <option value={0.8}>80%+ Confidence</option>
                <option value={0.85}>85%+ Confidence</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Signal List */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLoading && <LoadingSkeleton />}

        {isError && (
          <div className="glass-card p-8 text-center">
            <p className="text-red-400 mb-4">Failed to load signals</p>
            <button onClick={() => refetch()} className="btn-primary">
              Try Again
            </button>
          </div>
        )}

        {data && (
          <>
            {/* Stats */}
            <div className="mb-6 flex items-center justify-between text-gray-400">
              <p>
                Showing <span className="text-white font-semibold">{data.signals.length}</span>{' '}
                of {data.total} signals
              </p>
              <p className="text-sm">
                Updated {new Date().toLocaleTimeString()}
              </p>
            </div>

            {/* Signals */}
            <div className="space-y-4">
              {data.signals.map((signal, index) => (
                <SignalCard key={signal.ticker} signal={signal} index={index} />
              ))}
            </div>

            {/* Pagination */}
            {data.total > data.page_size && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  disabled={filters.page === 1}
                  onClick={() => handleFilterChange('page', filters.page - 1)}
                  className="btn-secondary"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-400">
                  Page {filters.page}
                </span>
                <button
                  disabled={filters.page * data.page_size >= data.total}
                  onClick={() => handleFilterChange('page', filters.page + 1)}
                  className="btn-secondary"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Supporting Components
// ============================================================================

function SignalCard({ signal, index }: { signal: SignalFeedItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link to={`/stock/${signal.ticker}`}>
        <div className="glass-card-hover p-6 group">
          <div className="flex items-start justify-between">
            {/* Left: Stock info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors">
                  {signal.ticker}
                </h3>
                <span className="text-2xl">{signal.emoji}</span>
                <SignalBadge signal={signal.signal} />
              </div>

              <p className="text-gray-400 mb-1">{signal.name}</p>

              <p className="text-white text-lg mb-3">{signal.reason_short}</p>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {signal.signal_age_hours}h ago
                </span>
                <span>•</span>
                <span>{signal.case_type}</span>
              </div>
            </div>

            {/* Right: Price & Confidence */}
            <div className="text-right ml-6">
              <p className="text-3xl font-bold text-white mb-1">
                ${signal.price.toFixed(2)}
              </p>
              <p
                className={`text-sm font-semibold mb-4 ${
                  signal.change_percent >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {signal.change_percent >= 0 ? '+' : ''}
                {signal.change_percent.toFixed(2)}%
              </p>

              <div className="w-32">
                <ConfidenceMeter
                  confidence={signal.confidence}
                  showPercentage={true}
                  size="sm"
                  animated={false}
                />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function FilterButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
        ${
          active
            ? 'bg-primary-600 text-white shadow-glow-purple'
            : 'bg-dark-card text-gray-400 hover:bg-dark-border hover:text-white'
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="glass-card p-6">
          <div className="flex justify-between">
            <div className="flex-1">
              <div className="skeleton h-8 w-32 mb-2" />
              <div className="skeleton h-4 w-48 mb-4" />
              <div className="skeleton h-6 w-96" />
            </div>
            <div className="skeleton h-12 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SignalFeed;
