import { TrendingUp, TrendingDown, Minus, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import type { Stock } from './dashboard'

type StockCardProps = {
  stock: Stock
  onRemove?: (ticker: string) => void
}

export function StockCard({ stock, onRemove }: StockCardProps) {
  const isPositive = stock.change >= 0
  const SignalIcon = stock.signal === 'bullish' ? TrendingUp : stock.signal === 'bearish' ? TrendingDown : Minus

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
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
            </div>
            <p className="text-sm text-muted-foreground">{stock.name}</p>
          </div>
          
          {onRemove && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onRemove(stock.ticker)}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Price */}
        <div className="space-y-1">
          <div className="text-3xl font-bold font-mono">${stock.price.toFixed(2)}</div>
          <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-success' : 'text-destructive'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)</span>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-sm text-pretty leading-relaxed border-l-2 border-accent pl-3 py-1">
          {stock.tagline}
        </p>

        {/* Ratings */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Technical</span>
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
              <span className="text-muted-foreground">Sentiment</span>
              <span className="font-semibold font-mono">{stock.sentimentRating}/100</span>
            </div>
            <Progress value={stock.sentimentRating} className="h-2" />
            <div className="text-xs text-muted-foreground space-y-0.5">
              <div>Score: {stock.sentimentDetails.score.toFixed(2)}</div>
              <div>Mentions: {stock.sentimentDetails.mentions}</div>
            </div>
          </div>
        </div>

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
      </div>
    </Card>
  )
}
