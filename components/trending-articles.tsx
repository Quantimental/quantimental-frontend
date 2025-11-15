import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, TrendingUp } from 'lucide-react'

type Article = {
  id: string
  title: string
  source: string
  time: string
  sentiment: 'positive' | 'negative' | 'neutral'
  tickers: string[]
}

const articles: Article[] = [
  {
    id: '1',
    title: 'Apple Reports Record Q4 Earnings, Beats Expectations',
    source: 'Bloomberg',
    time: '2h ago',
    sentiment: 'positive',
    tickers: ['AAPL'],
  },
  {
    id: '2',
    title: 'Tesla Faces Production Challenges in Shanghai Factory',
    source: 'Reuters',
    time: '4h ago',
    sentiment: 'negative',
    tickers: ['TSLA'],
  },
  {
    id: '3',
    title: 'Microsoft and Google Announce AI Partnership',
    source: 'TechCrunch',
    time: '6h ago',
    sentiment: 'positive',
    tickers: ['MSFT', 'GOOGL'],
  },
  {
    id: '4',
    title: 'Tech Sector Shows Strong Momentum Amid Rate Optimism',
    source: 'CNBC',
    time: '8h ago',
    sentiment: 'positive',
    tickers: ['AAPL', 'MSFT', 'GOOGL'],
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
        {articles.map((article) => (
          <Card 
            key={article.id} 
            className="p-4 hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-semibold leading-tight text-pretty group-hover:text-accent transition-colors">
                  {article.title}
                </h3>
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
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="font-medium">{article.source}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{article.time}</span>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  {article.tickers.map((ticker) => (
                    <Badge key={ticker} variant="secondary" className="text-xs font-mono">
                      {ticker}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
