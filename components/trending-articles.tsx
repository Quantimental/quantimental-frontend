import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'

type Article = {
  id: string
  title: string
  source: string
  time: string
  sentiment: 'positive' | 'negative' | 'neutral'
  tickers: string[]
  // New fields for impact
  impact: 'low' | 'medium' | 'high'
  mentionCount: number
  sentimentTrend: 'rising' | 'steady' | 'falling'
  priceImpact?: Record<string, number> // ticker -> percentage change
}

const articles: Article[] = [
  {
    id: '1',
    title: 'Apple Reports Record Q4 Earnings, Beats Expectations',
    source: 'Bloomberg',
    time: '2h ago',
    sentiment: 'positive',
    tickers: ['AAPL'],
    impact: 'high',
    mentionCount: 2341,
    sentimentTrend: 'rising',
    priceImpact: { AAPL: 2.5 },
  },
  {
    id: '2',
    title: 'Tesla Faces Production Challenges in Shanghai Factory',
    source: 'Reuters',
    time: '4h ago',
    sentiment: 'negative',
    tickers: ['TSLA'],
    impact: 'high',
    mentionCount: 1876,
    sentimentTrend: 'falling',
    priceImpact: { TSLA: -3.2 },
  },
  {
    id: '3',
    title: 'Microsoft and Google Announce AI Partnership',
    source: 'TechCrunch',
    time: '6h ago',
    sentiment: 'positive',
    tickers: ['MSFT', 'GOOGL'],
    impact: 'medium',
    mentionCount: 945,
    sentimentTrend: 'rising',
    priceImpact: { MSFT: 1.8, GOOGL: 0.9 },
  },
  {
    id: '4',
    title: 'Tech Sector Shows Strong Momentum Amid Rate Optimism',
    source: 'CNBC',
    time: '8h ago',
    sentiment: 'positive',
    tickers: ['AAPL', 'MSFT', 'GOOGL'],
    impact: 'medium',
    mentionCount: 678,
    sentimentTrend: 'steady',
    priceImpact: { AAPL: 0.5, MSFT: 1.2, GOOGL: 0.3 },
  },
]

export function TrendingArticles() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-accent" />
        <h2 className="text-2xl font-bold">Trending Articles</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {articles.map((article, index) => {
          const impactColor = {
            low: 'border-yellow-500/30 bg-yellow-500/5',
            medium: 'border-blue-500/30 bg-blue-500/5',
            high: 'border-success/30 bg-success/5',
          }[article.impact]

          return (
            <Card 
              key={article.id} 
              className={`p-4 hover:shadow-lg transition-all cursor-pointer group border-l-4 animate-fade-in-up ${impactColor}`}
              style={{
                animation: `fade-in-up 0.5s ease-out ${index * 0.1}s backwards`
              }}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold leading-tight text-pretty group-hover:text-accent transition-colors">
                    {article.title}
                  </h3>
                  <div className="flex gap-2 flex-shrink-0">
                    {/* Sentiment Badge */}
                    <Badge 
                      variant="outline"
                      className={
                        article.sentiment === 'positive'
                          ? 'bg-success/10 text-success border-success'
                          : article.sentiment === 'negative'
                          ? 'bg-destructive/10 text-destructive border-destructive'
                          : 'bg-muted text-muted-foreground'
                      }
                    >
                      {article.sentiment}
                    </Badge>

                    {/* Impact Badge */}
                    <Badge 
                      variant="secondary"
                      className={
                        article.impact === 'high'
                          ? 'bg-success/20 text-success'
                          : article.impact === 'medium'
                          ? 'bg-blue-500/20 text-blue-500'
                          : 'bg-yellow-500/20 text-yellow-500'
                      }
                    >
                      <BarChart3 className="w-3 h-3 mr-1" />
                      {article.impact}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span className="font-medium">{article.source}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.time}</span>
                    </div>
                  </div>
                </div>

                {/* Sentiment Trend & Mentions */}
                <div className="flex items-center gap-4 pt-2 border-t border-border/30 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    {article.sentimentTrend === 'rising' ? (
                      <TrendingUp className="w-3 h-3 text-success" />
                    ) : article.sentimentTrend === 'falling' ? (
                      <TrendingDown className="w-3 h-3 text-destructive" />
                    ) : (
                      <span className="text-yellow-500">→</span>
                    )}
                    <span>
                      {article.sentimentTrend === 'rising'
                        ? 'Momentum rising'
                        : article.sentimentTrend === 'falling'
                        ? 'Momentum falling'
                        : 'Steady'}
                    </span>
                  </div>
                  <span>•</span>
                  <span>{article.mentionCount.toLocaleString()} mentions</span>
                </div>

                {/* Price Impact */}
                {article.priceImpact && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {article.tickers.map((ticker) => {
                      const impact = article.priceImpact?.[ticker]
                      return (
                        <Badge 
                          key={ticker} 
                          variant="secondary" 
                          className={`text-xs font-mono ${
                            impact && impact > 0
                              ? 'bg-success/20 text-success'
                              : impact && impact < 0
                              ? 'bg-destructive/20 text-destructive'
                              : ''
                          }`}
                        >
                          {ticker}
                          {impact && (
                            <span className="ml-1">
                              {impact > 0 ? '+' : ''}{impact.toFixed(1)}%
                            </span>
                          )}
                        </Badge>
                      )
                    })}
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
