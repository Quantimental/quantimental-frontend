/**
 * Signal Badge Component
 *
 * Displays signal type with color coding and emoji.
 * Used across Feed, Detail, and Watchlist screens.
 */

import { type SignalType } from '@/types/api';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SignalBadgeProps {
  signal: SignalType;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function SignalBadge({ signal, size = 'md', showIcon = true }: SignalBadgeProps) {
  const config = getSignalConfig(signal);

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-semibold
        ${config.className} ${sizeClasses[size]}
        transition-all duration-200
      `}
    >
      {showIcon && <config.icon size={iconSizes[size]} />}
      <span>{config.label}</span>
    </span>
  );
}

function getSignalConfig(signal: SignalType) {
  switch (signal) {
    case 'STRONG_BUY':
      return {
        label: 'Strong Buy',
        className: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        icon: TrendingUp,
      };
    case 'BUY':
      return {
        label: 'Buy',
        className: 'bg-green-500/20 text-green-400 border border-green-500/30',
        icon: TrendingUp,
      };
    case 'HOLD':
      return {
        label: 'Hold',
        className: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        icon: Minus,
      };
    case 'SELL':
      return {
        label: 'Sell',
        className: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
        icon: TrendingDown,
      };
    case 'STRONG_SELL':
      return {
        label: 'Strong Sell',
        className: 'bg-red-500/20 text-red-400 border border-red-500/30',
        icon: TrendingDown,
      };
    default:
      return {
        label: 'Unknown',
        className: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
        icon: Minus,
      };
  }
}

export default SignalBadge;
