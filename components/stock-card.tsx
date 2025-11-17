import { useState } from 'react'
import { TrendingUp, TrendingDown, Minus, X, Info, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Sparkline } from './sparkline'
import type { Stock } from './dashboard'
import { getSignalFreshness } from '@/lib/market-engine'

type StockCardProps = {
  stock: Stock
  onRemove?: (ticker: string) => void
}

export function StockCard({ stock, onRemove }: StockCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const isPositive = stock.change >= 0
  const SignalIcon = stock.signal === 'bullish' ? TrendingUp : stock.signal === 'bearish' ? TrendingDown : Minus
  
  // Get signal freshness
  const signalFreshness = getSignalFreshness(stock.signalAge || Date.now())
  const freshnessBadgeConfig = {
    'new': { bg: 'bg-success/20', text: 'text-success', label: 'NEW' },
    'fresh': { bg: 'bg-green-500/20', text: 'text-green-500', label: 'Fresh' },
    'recent': { bg: 'bg-yellow-500/20', text: 'text-yellow-500', label: 'Recent' },
    'stale': { bg: 'bg-muted/20', text: 'text-muted-foreground', label: 'Stale' }
  }
  const freshnessConfig = freshnessBadgeConfig[signalFreshness]

  return (
    <TooltipProvider>
      <Card className="p-6 hover:shadow-lg hover:shadow-accent/30 transition-smooth animate-fade-in-up">
        <div className="space-y-4">
          {/* Header with Signal Freshness Badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-2xl font-bold font-mono">{stock.ticker}</h3>
                <Badge 
                  variant="outline" 
                  className={
                    stock.signal === 'bullish' 
                      ? 'border-success text-success' 
                      : stock.signal === 'bearish' 
                      ? 'border-destructive text-destructive'
                      : 'border-muted-foreground text-muted-foreground'
                  }
                >
                  <SignalIcon className="w-3 h-3 mr-1" />
                  {stock.signal.toUpperCase()}
                </Badge>
                
                {/* Signal Age Badge */}
                <Badge 
                  variant="secondary"
                  className={`${freshnessConfig.bg} ${freshnessConfig.text} border-0`}
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {freshnessConfig.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{stock.name}</p>
            </div>
            
            {onRemove && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onRemove(stock.ticker)}
                className="h-8 w-8 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

        {/* Price */}
        <div className="space-y-1">
          <div className="text-3xl font-bold font-mono transition-smooth">${stock.price.toFixed(2)}</div>
          <div className={`flex items-center gap-1 text-sm font-medium transition-smooth ${isPositive ? 'text-success' : 'text-destructive'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4 animate-pulse" /> : <TrendingDown className="w-4 h-4 animate-pulse" />}
            <span>{isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)</span>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-sm text-pretty leading-relaxed border-l-2 border-accent pl-3 py-1">
          {stock.tagline}
        </p>

        {/* 7-Day Price Sparkline */}
        {stock.priceHistory && stock.priceHistory.length > 1 && (
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium">7-Day Trend</label>
            <div className="h-10 -mx-1 px-1">
              <Sparkline 
                data={stock.priceHistory}
                isPositive={stock.priceHistory[stock.priceHistory.length - 1] >= stock.priceHistory[0]}
                height={40}
                strokeWidth={2}
              />
            </div>
          </div>
        )}

          {/* Recommendation Block - THE CORE SIGNAL */}
          {stock.recommendation && (
            <div className={`p-4 rounded-lg border-2 transition-smooth ${
              stock.recommendation.action === 'strong_buy' 
                ? 'border-success/50 bg-success/5 animate-pulse-glow'
              : stock.recommendation.action === 'buy' 
                ? 'border-green-500/50 bg-green-500/5 hover:shadow-lg hover:shadow-green-500/20'
              : stock.recommendation.action === 'hold' 
                ? 'border-yellow-500/50 bg-yellow-500/5 hover:shadow-lg hover:shadow-yellow-500/20'
              : stock.recommendation.action === 'sell' 
                ? 'border-orange-500/50 bg-orange-500/5 hover:shadow-lg hover:shadow-orange-500/20'
              : 'border-destructive/50 bg-destructive/5 animate-pulse-glow-red'
            }`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Recommendation</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-sm">
                        {stock.recommendation.reasons.join(' • ')}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className={`text-lg font-bold uppercase ${
                    stock.recommendation.action === 'strong_buy' ? 'text-success'
                    : stock.recommendation.action === 'buy' ? 'text-green-500'
                    : stock.recommendation.action === 'hold' ? 'text-yellow-500'
                    : stock.recommendation.action === 'sell' ? 'text-orange-500'
                    : 'text-destructive'
                  }`}>
                    {stock.recommendation.action.replace('_', ' ')}
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground">
                    {stock.recommendation.confidence}% confidence
                  </span>
                </div>
              </div>
            </div>
          )}

        {/* Ratings with Tooltips */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Technical</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <div className="max-w-xs text-sm space-y-1">
                      <p><strong>RSI {stock.technicalDetails.rsi}:</strong> {
                        stock.technicalDetails.rsi > 70 ? 'Overbought conditions - potential pullback'
                        : stock.technicalDetails.rsi < 30 ? 'Oversold conditions - potential bounce'
                        : 'Neutral momentum'
                      }</p>
                      <p><strong>MA50 ${stock.technicalDetails.ma50.toFixed(2)}:</strong> {
                        stock.price > stock.technicalDetails.ma50 ? 'Above 50-day MA - uptrend bias'
                        : 'Below 50-day MA - downtrend bias'
                      }</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="font-semibold font-mono">{stock.technicalRating}/100</span>
            </div>
            <Progress value={stock.technicalRating} className="h-2" />
            <div className="text-xs text-muted-foreground space-y-0.5">
              <div>RSI: {stock.technicalDetails.rsi}</div>
              <div>MA50: ${stock.technicalDetails.ma50.toFixed(2)}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Sentiment</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <div className="max-w-xs text-sm space-y-1">
                      <p><strong>Sentiment {stock.sentimentDetails.score.toFixed(2)}:</strong> {
                        stock.sentimentDetails.score > 0.75 ? 'Extremely bullish - high conviction'
                        : stock.sentimentDetails.score > 0.5 ? 'Positive sentiment'
                        : stock.sentimentDetails.score > 0.25 ? 'Slightly positive'
                        : 'Negative sentiment'
                      }</p>
                      <p><strong>Mentions {stock.sentimentDetails.mentions}:</strong> {
                        stock.sentimentDetails.velocity === 'rising' ? '📈 Rising - attention increasing'
                        : stock.sentimentDetails.velocity === 'falling' ? '📉 Falling - interest waning'
                        : '➡️ Steady - consistent discussion'
                      }</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="font-semibold font-mono">{stock.sentimentRating}/100</span>
            </div>
            <Progress value={stock.sentimentRating} className="h-2" />
            <div className="text-xs text-muted-foreground space-y-0.5">
              <div>Score: {stock.sentimentDetails.score.toFixed(2)}</div>
              <div>Mentions: {stock.sentimentDetails.mentions}</div>
            </div>
          </div>
        </div>

        {/* Hybrid Score Breakdown */}
        {stock.hybridScore !== undefined && stock.hybridWeights && (
          <div className="p-3 rounded-lg bg-accent/5 border border-accent/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-accent">HYBRID CALCULATION</span>
              <span className="text-lg font-bold text-accent">{stock.hybridScore}/100</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-muted-foreground">
                Technical: <span className="font-semibold">{(stock.hybridWeights.technical * 100).toFixed(0)}%</span>
              </div>
              <div className="text-muted-foreground">
                Sentiment: <span className="font-semibold">{(stock.hybridWeights.sentiment * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Spectrum */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>BEARISH</span>
            <span>BULLISH</span>
          </div>
          <div className="relative h-3 rounded-full bg-gradient-to-r from-destructive via-muted to-success overflow-hidden">
            <div 
              className="absolute top-0 bottom-0 w-1 bg-foreground rounded-full shadow-lg"
              style={{ 
                left: `${((stock.technicalRating + stock.sentimentRating) / 2)}%`,
                transform: 'translateX(-50%)'
              }}
            />
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-4 transition-smooth group"
        >
          <span className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground group-hover:text-foreground">
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show Details
              </>
            )}
          </span>
        </Button>

        {/* Detailed View - Hidden by default */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-border/50 space-y-4 animate-fade-in-up">
            <div className="grid grid-cols-2 gap-4">
              {/* Technical Details */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-accent uppercase">Technical Details</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>RSI:</span>
                    <span className="font-semibold text-foreground">{stock.technicalDetails.rsi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>MA50:</span>
                    <span className="font-semibold text-foreground">${stock.technicalDetails.ma50.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>MA200:</span>
                    <span className="font-semibold text-foreground">${stock.technicalDetails.ma200.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border/30">
                    <span>Price vs MA50:</span>
                    <span className={stock.price > stock.technicalDetails.ma50 ? 'text-success font-semibold' : 'text-destructive font-semibold'}>
                      {((((stock.price - stock.technicalDetails.ma50) / stock.technicalDetails.ma50) * 100)).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Sentiment Details */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-accent uppercase">Sentiment Details</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Sentiment Score:</span>
                    <span className="font-semibold text-foreground">{(stock.sentimentDetails.score * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Mentions:</span>
                    <span className="font-semibold text-foreground">{stock.sentimentDetails.mentions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Velocity:</span>
                    <span className={`font-semibold ${
                      stock.sentimentDetails.velocity === 'rising' ? 'text-success' 
                      : stock.sentimentDetails.velocity === 'falling' ? 'text-destructive'
                      : 'text-yellow-500'
                    }`}>
                      {stock.sentimentDetails.velocity}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border/30">
                    <span>Sentiment vs Tech:</span>
                    <span className="font-semibold text-foreground">
                      {(stock.sentimentRating - stock.technicalRating > 0 ? '+' : '')}{stock.sentimentRating - stock.technicalRating}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Summary */}
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30 space-y-2">
              <h4 className="text-xs font-semibold text-accent uppercase">Analysis Summary</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>
                  <span className="font-semibold">Technical Trend:</span>{' '}
                  {stock.price > stock.technicalDetails.ma200
                    ? 'Uptrend (above MA200)'
                    : 'Downtrend (below MA200)'}
                </p>
                <p>
                  <span className="font-semibold">Momentum:</span>{' '}
                  {stock.technicalDetails.rsi > 70
                    ? 'Overbought'
                    : stock.technicalDetails.rsi < 30
                    ? 'Oversold'
                    : 'Neutral'}
                </p>
                <p>
                  <span className="font-semibold">Sentiment Direction:</span>{' '}
                  {stock.sentimentDetails.velocity === 'rising'
                    ? 'Strengthening'
                    : stock.sentimentDetails.velocity === 'falling'
                    ? 'Weakening'
                    : 'Stable'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      </Card>
    </TooltipProvider>
  )
}
