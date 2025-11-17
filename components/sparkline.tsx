'use client'

/**
 * Compact Sparkline Component
 * 
 * Lightweight 7-day price sparkline visualization
 * Shows trend at a glance without overwhelming the UI
 */

type SparklineProps = {
  data: number[] // array of prices (e.g., 7-day data)
  isPositive?: boolean // override color: green if true, red if false
  height?: number // default 40px
  strokeWidth?: number // default 2
}

export function Sparkline({ 
  data, 
  isPositive, 
  height = 40,
  strokeWidth = 2
}: SparklineProps) {
  if (!data || data.length < 2) return null

  const width = data.length * 12 // each point gets 12px spacing
  const padding = 4
  const viewHeight = height - padding * 2

  // Find min/max
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  // Determine color based on trend
  const isUp = isPositive !== undefined ? isPositive : data[data.length - 1] >= data[0]
  const color = isUp ? '#10b981' : '#ef4444' // green or red

  // Generate SVG path
  const points = data.map((value, index) => {
    const x = padding + index * 12
    const y = padding + (1 - (value - min) / range) * viewHeight
    return `${x},${y}`
  })

  const pathD = `M ${points.join(' L ')}`

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="w-full h-full"
    >
      {/* Path line */}
      <path
        d={pathD}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Subtle fill under curve */}
      <path
        d={`M ${points[0]} L ${pathD.replace(/^M /, '')} L ${width - padding},${padding + viewHeight} L ${padding},${padding + viewHeight} Z`}
        fill={color}
        opacity="0.1"
      />

      {/* Small dots at key points */}
      {[0, data.length - 1].map((index) => {
        const x = padding + index * 12
        const y = padding + (1 - (data[index] - min) / range) * viewHeight
        return (
          <circle
            key={index}
            cx={x}
            cy={y}
            r="2"
            fill={color}
            opacity="0.6"
          />
        )
      })}
    </svg>
  )
}

