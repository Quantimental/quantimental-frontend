/**
 * Confidence Meter Component
 *
 * Visualizes signal confidence as a gradient bar.
 * Shows percentage with color-coded intensity.
 */

import { motion } from 'framer-motion';

interface ConfidenceMeterProps {
  confidence: number; // 0.0 to 1.0
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function ConfidenceMeter({
  confidence,
  showPercentage = true,
  size = 'md',
  animated = true,
}: ConfidenceMeterProps) {
  const percentage = Math.round(confidence * 100);

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  // Color based on confidence level
  const getGradient = () => {
    if (percentage >= 85) {
      return 'from-emerald-500 via-green-500 to-emerald-400'; // High confidence
    } else if (percentage >= 70) {
      return 'from-green-500 via-lime-500 to-green-400'; // Good confidence
    } else if (percentage >= 55) {
      return 'from-yellow-500 via-amber-500 to-yellow-400'; // Moderate
    } else {
      return 'from-orange-500 via-red-500 to-orange-400'; // Low confidence
    }
  };

  const BarComponent = animated ? motion.div : 'div';

  return (
    <div className="w-full">
      {showPercentage && (
        <div className="flex items-center justify-between mb-1.5">
          <span className={`${textSizes[size]} text-gray-400 font-medium`}>
            Confidence
          </span>
          <span className={`${textSizes[size]} font-semibold gradient-text`}>
            {percentage}%
          </span>
        </div>
      )}

      {/* Background bar */}
      <div className={`w-full bg-dark-border rounded-full overflow-hidden ${heightClasses[size]}`}>
        {/* Confidence bar */}
        <BarComponent
          className={`bg-gradient-to-r ${getGradient()} rounded-full ${heightClasses[size]} shadow-glow-purple`}
          style={{ width: `${percentage}%` }}
          {...(animated && {
            initial: { width: 0 },
            animate: { width: `${percentage}%` },
            transition: { duration: 0.8, ease: 'easeOut' },
          })}
        />
      </div>

      {/* Confidence label */}
      {showPercentage && (
        <div className={`mt-1 ${textSizes[size]} text-gray-500`}>
          {getConfidenceLabel(percentage)}
        </div>
      )}
    </div>
  );
}

function getConfidenceLabel(percentage: number): string {
  if (percentage >= 85) {
    return 'Very High Confidence';
  } else if (percentage >= 70) {
    return 'High Confidence';
  } else if (percentage >= 55) {
    return 'Moderate Confidence';
  } else {
    return 'Low Confidence';
  }
}

export default ConfidenceMeter;
