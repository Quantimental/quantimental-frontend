'use client'

import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { MarketMood } from '@/lib/market-engine'

type SignalSummaryBarProps = {
  strongBuy: number
  buy: number
  hold: number
  sell: number
  strongSell: number
  marketMood: MarketMood
  marketInsight: string
  avgSentiment: number
  medianRsi: number
}

const moodConfig: Record<MarketMood, { color: string; bg: string; icon: React.ReactNode }> = {
  bullish: {
    color: 'text-success',
    bg: 'bg-success/10',
    icon: <TrendingUp className="w-4 h-4" />
  },
  cautious_bullish: {
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    icon: <TrendingUp className="w-4 h-4" />
  },
  neutral: {
    color: 'text-muted-foreground',
    bg: 'bg-muted/50',
    icon: <AlertCircle className="w-4 h-4" />
  },
  cautious_bearish: {
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    icon: <TrendingDown className="w-4 h-4" />
  },
  bearish: {
    color: 'text-destructive',
    bg: 'bg-destructive/10',
    icon: <TrendingDown className="w-4 h-4" />
  }
}

export function SignalSummaryBar({
  strongBuy,
  buy,
  hold,
  sell,
  strongSell,
  marketMood,
  marketInsight,
  avgSentiment,
  medianRsi
}: SignalSummaryBarProps) {
  const total = strongBuy + buy + hold + sell + strongSell
  const config = moodConfig[marketMood]

  return (
    <Card className="p-6 bg-gradient-to-r from-card to-card/50 border-accent/20">
      <div className="space-y-4">
        {/* Header with Market Mood */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              🔮 Today's Signals
            </h3>
            <p className="text-lg font-bold text-foreground">{marketInsight}</p>
          </div>

          <div className={`flex items-center gap-2 px-4 py-3 rounded-lg ${config.bg}`}>
            <div className={`${config.color}`}>
              {config.icon}
            </div>
            <div className="text-right">
              <p className={`text-xs font-semibold ${config.color} uppercase`}>
                {marketMood.replace('_', ' ')}
              </p>
              <p className="text-xs text-muted-foreground">
                Sentiment: {avgSentiment >= 0 ? '+' : ''}{avgSentiment.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Signal Distribution Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3">
          {/* Strong Buy */}
          <div className="p-3 rounded-lg bg-success/10 border border-success/30 hover:border-success/60 transition-colors">
            <div className="text-2xl font-bold text-success">{strongBuy}</div>
            <div className="text-xs text-muted-foreground font-medium">Strong Buy</div>
            <div className="text-xs text-success/70 mt-1">
              {total > 0 ? ((strongBuy / total) * 100).toFixed(0) : 0}%
            </div>
          </div>

          {/* Buy */}
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 hover:border-green-500/60 transition-colors">
            <div className="text-2xl font-bold text-green-500">{buy}</div>
            <div className="text-xs text-muted-foreground font-medium">Buy</div>
            <div className="text-xs text-green-500/70 mt-1">
              {total > 0 ? ((buy / total) * 100).toFixed(0) : 0}%
            </div>
          </div>

          {/* Hold */}
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 hover:border-yellow-500/60 transition-colors">
            <div className="text-2xl font-bold text-yellow-500">{hold}</div>
            <div className="text-xs text-muted-foreground font-medium">Hold</div>
            <div className="text-xs text-yellow-500/70 mt-1">
              {total > 0 ? ((hold / total) * 100).toFixed(0) : 0}%
            </div>
          </div>

          {/* Sell */}
          <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30 hover:border-orange-500/60 transition-colors">
            <div className="text-2xl font-bold text-orange-500">{sell}</div>
            <div className="text-xs text-muted-foreground font-medium">Sell</div>
            <div className="text-xs text-orange-500/70 mt-1">
              {total > 0 ? ((sell / total) * 100).toFixed(0) : 0}%
            </div>
          </div>

          {/* Strong Sell */}
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 hover:border-destructive/60 transition-colors">
            <div className="text-2xl font-bold text-destructive">{strongSell}</div>
            <div className="text-xs text-muted-foreground font-medium">Strong Sell</div>
            <div className="text-xs text-destructive/70 mt-1">
              {total > 0 ? ((strongSell / total) * 100).toFixed(0) : 0}%
            </div>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50 text-xs text-muted-foreground">
          <div>
            <span className="font-medium">Median RSI:</span>
            <span className="ml-2 text-foreground font-semibold">{medianRsi.toFixed(0)}</span>
          </div>
          <div>
            <span className="font-medium">Total Tracked:</span>
            <span className="ml-2 text-foreground font-semibold">{total}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

