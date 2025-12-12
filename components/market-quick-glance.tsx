'use client'

import { TrendingUp, TrendingDown, Zap, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { MarketMood } from '@/lib/market-engine'

type MarketQuickGlanceProps = {
  // Signal distribution
  strongBuy: number
  buy: number
  hold: number
  sell: number
  strongSell: number
  
  // Market mood
  marketMood: MarketMood
  sentiment: number
  hypyVelocity: number
  fearGreedTilt: number
  vixLevel: number
}

const moodConfig: Record<MarketMood, { icon: string; color: string }> = {
  bullish: { icon: '🚀', color: 'bg-success/20 text-success border-success/50' },
  cautious_bullish: { icon: '📈', color: 'bg-green-500/20 text-green-500 border-green-500/50' },
  neutral: { icon: '⚖️', color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' },
  cautious_bearish: { icon: '📉', color: 'bg-orange-500/20 text-orange-500 border-orange-500/50' },
  bearish: { icon: '🔻', color: 'bg-destructive/20 text-destructive border-destructive/50' },
}

export function MarketQuickGlance({
  strongBuy,
  buy,
  hold,
  sell,
  strongSell,
  marketMood,
  sentiment,
  hypyVelocity,
  fearGreedTilt,
  vixLevel,
}: MarketQuickGlanceProps) {
  const total = strongBuy + buy + hold + sell + strongSell
  const bullishCount = strongBuy + buy
  const bearishCount = sell + strongSell
  const bullishPercent = total > 0 ? ((bullishCount / total) * 100).toFixed(0) : 0
  
  const config = moodConfig[marketMood]
  
  // VIX color
  const getVixColor = (vix: number) => {
    if (vix < 12) return 'text-success'
    if (vix < 16) return 'text-green-500'
    if (vix < 20) return 'text-yellow-500'
    if (vix < 30) return 'text-orange-500'
    return 'text-destructive'
  }
  
  // Sentiment arrow
  const sentimentArrow = sentiment > 0.1 ? '↗' : sentiment < -0.1 ? '↘' : '→'
  const sentimentColor = sentiment > 0.1 ? 'text-success' : sentiment < -0.1 ? 'text-destructive' : 'text-muted-foreground'

  return (
    <div className="border-b bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          
          {/* Signal Distribution - Compact */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Signals:</span>
            <div className="flex gap-1">
              {strongBuy > 0 && (
                <Badge variant="outline" className="bg-success/10 text-success border-success/50 text-xs">
                  SB: {strongBuy}
                </Badge>
              )}
              {buy > 0 && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/50 text-xs">
                  B: {buy}
                </Badge>
              )}
              {hold > 0 && (
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/50 text-xs">
                  H: {hold}
                </Badge>
              )}
              {bearishCount > 0 && (
                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/50 text-xs">
                  S: {bearishCount}
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs">
                {bullishPercent}% Bullish
              </Badge>
            </div>
          </div>

          {/* Market Mood - Compact */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${config.color}`}>
            <span className="text-lg">{config.icon}</span>
            <span className="text-xs font-semibold capitalize">{marketMood.replace('_', ' ')}</span>
          </div>

          {/* Sentiment - Compact */}
          <div className={`flex items-center gap-1 text-xs font-medium ${sentimentColor}`}>
            <span>{sentimentArrow}</span>
            <span>Sentiment: {sentiment.toFixed(2)}</span>
          </div>

          {/* Hype Velocity - Compact */}
          <div className="flex items-center gap-1 text-xs">
            <Zap className={`w-3 h-3 ${hypyVelocity > 0 ? 'text-success' : hypyVelocity < 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
            <span className="text-muted-foreground">Velocity:</span>
            <span className={hypyVelocity > 0 ? 'text-success font-semibold' : hypyVelocity < 0 ? 'text-destructive font-semibold' : 'text-muted-foreground'}>
              {hypyVelocity > 0 ? '+' : ''}{hypyVelocity.toFixed(1)}%
            </span>
          </div>

          {/* Fear/Greed - Compact */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-muted-foreground">Fear/Greed:</span>
            <span className={fearGreedTilt > 60 ? 'text-success font-semibold' : fearGreedTilt < 40 ? 'text-destructive font-semibold' : 'text-yellow-500 font-semibold'}>
              {fearGreedTilt.toFixed(0)}
            </span>
          </div>

          {/* VIX - Compact */}
          <div className={`flex items-center gap-1 text-xs font-medium ${getVixColor(vixLevel)}`}>
            <AlertCircle className="w-3 h-3" />
            <span>VIX: {vixLevel.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
