'use client'

import { Flame, Zap, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { MarketMood } from '@/lib/market-engine'

type MarketMoodIndicatorProps = {
  sentiment: number // -1 to 1
  hypyVelocity: number // -100 to 100
  fearGreedTilt: number // 0 to 100
  vixLevel: number
  mood: MarketMood
}

export function MarketMoodIndicator({
  sentiment,
  hypyVelocity,
  fearGreedTilt,
  vixLevel,
  mood
}: MarketMoodIndicatorProps) {
  // Sentiment color: -1 (red) to 1 (green)
  const getSentimentColor = (s: number) => {
    if (s > 0.5) return 'from-emerald-500 to-green-500'
    if (s > 0.1) return 'from-lime-500 to-green-500'
    if (s > -0.1) return 'from-yellow-500 to-amber-500'
    if (s > -0.5) return 'from-orange-500 to-red-500'
    return 'from-red-600 to-rose-500'
  }

  // Hype velocity indicator
  const getHypeColor = (hype: number) => {
    if (hype > 20) return 'text-success'
    if (hype > 0) return 'text-yellow-500'
    if (hype > -20) return 'text-orange-500'
    return 'text-destructive'
  }

  // Fear/Greed positioning
  const fearGreedPercent = fearGreedTilt
  const isFear = fearGreedPercent < 50
  const isGreed = fearGreedPercent > 50

  // VIX interpretation
  const getVixInterpretation = (vix: number) => {
    if (vix < 12) return { text: 'Very Calm', color: 'text-success' }
    if (vix < 16) return { text: 'Calm', color: 'text-green-500' }
    if (vix < 20) return { text: 'Normal', color: 'text-yellow-500' }
    if (vix < 30) return { text: 'Elevated', color: 'text-orange-500' }
    return { text: 'High Volatility', color: 'text-destructive' }
  }

  const vixInfo = getVixInterpretation(vixLevel)

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Market Psychology
        </h3>
      </div>

      {/* Sentiment Gauge */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Market Sentiment</label>
          <span className="text-sm font-semibold text-foreground">
            {sentiment > 0 ? '+' : ''}{sentiment.toFixed(2)}
          </span>
        </div>
        <div className="relative h-3 rounded-full bg-gradient-to-r from-red-600 via-yellow-500 to-emerald-500 overflow-hidden">
          {/* Sentiment needle */}
          <div
            className="absolute top-0 bottom-0 w-1.5 bg-foreground rounded-full shadow-lg transition-all"
            style={{
              left: `${((sentiment + 1) / 2) * 100}%`,
              transform: 'translateX(-50%)'
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Bearish</span>
          <span>Bullish</span>
        </div>
      </div>

      {/* Hype Velocity */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className={`w-4 h-4 ${getHypeColor(hypyVelocity)}`} />
            <label className="text-sm font-medium">Hype Velocity</label>
          </div>
          <span className={`text-sm font-semibold ${getHypeColor(hypyVelocity)}`}>
            {hypyVelocity > 0 ? '+' : ''}{hypyVelocity.toFixed(1)}%
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {hypyVelocity > 20
            ? '🔥 Hype accelerating - momentum picking up'
            : hypyVelocity > 0
            ? '📈 Steady interest increase'
            : hypyVelocity > -20
            ? '📉 Interest cooling down'
            : '❄️ Hype velocity falling sharply'}
        </p>
      </div>

      {/* Fear/Greed Spectrum */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Fear/Greed Index</label>
          <span className="text-sm font-semibold text-foreground">{fearGreedPercent.toFixed(0)}</span>
        </div>
        <div className="relative h-3 rounded-full bg-gradient-to-r from-destructive via-yellow-500 to-success overflow-hidden">
          <div
            className="absolute top-0 bottom-0 w-1.5 bg-foreground rounded-full shadow-lg transition-all"
            style={{
              left: `${fearGreedPercent}%`,
              transform: 'translateX(-50%)'
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Fear</span>
          <span>Greed</span>
        </div>
        <div className="flex gap-2 pt-2">
          {isFear && (
            <div className="flex-1 p-2 rounded-md bg-destructive/10 border border-destructive/30">
              <p className="text-xs text-destructive font-medium">⚠️ Fear Dominant</p>
            </div>
          )}
          {isGreed && (
            <div className="flex-1 p-2 rounded-md bg-success/10 border border-success/30">
              <p className="text-xs text-success font-medium">🤑 Greed Dominant</p>
            </div>
          )}
        </div>
      </div>

      {/* VIX Level */}
      <div className="space-y-3 p-3 rounded-lg bg-muted/30 border border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <label className="text-sm font-medium">Volatility (VIX)</label>
          </div>
          <span className={`text-sm font-semibold ${vixInfo.color}`}>
            {vixLevel.toFixed(1)}
          </span>
        </div>
        <p className={`text-xs font-medium ${vixInfo.color}`}>
          {vixInfo.text}
        </p>
        <p className="text-xs text-muted-foreground">
          {vixLevel < 16
            ? 'Market relatively calm - confidence high'
            : vixLevel < 20
            ? 'Normal volatility levels'
            : vixLevel < 30
            ? 'Market anxiety rising - watch closely'
            : 'Significant market turbulence - high risk'}
        </p>
      </div>

      {/* Market Mood Summary */}
      <div className="p-4 rounded-lg bg-accent/5 border border-accent/30">
        <p className="text-xs font-medium text-accent mb-1">Current Market Regime</p>
        <p className="text-sm text-foreground capitalize">
          {mood === 'bullish' && '🚀 Strong bullish conviction - momentum rules'}
          {mood === 'cautious_bullish' && '📈 Cautious optimism - opportunity with caution'}
          {mood === 'neutral' && '⚖️ Balanced - waiting for direction'}
          {mood === 'cautious_bearish' && '📉 Cautious pessimism - risk rising'}
          {mood === 'bearish' && '🔻 Bearish conviction - defensive positioning'}
        </p>
      </div>
    </Card>
  )
}

