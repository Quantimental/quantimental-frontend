import { Bookmark } from 'lucide-react'
import { StockCard } from './stock-card'
import { StockSearch } from './stock-search'
import type { Stock } from './dashboard'

type WatchlistSectionProps = {
  stocks: Stock[]
  onRemoveStock: (ticker: string) => void
  onAddStock: (stock: Stock) => void
}

export function WatchlistSection({ stocks, onRemoveStock, onAddStock }: WatchlistSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-accent" />
          <h2 className="text-2xl font-bold">Your Watchlist</h2>
          <span className="text-sm text-muted-foreground">({stocks.length} stocks)</span>
        </div>
        
        <StockSearch 
          onAddStock={onAddStock}
          watchlistTickers={stocks.map(s => s.ticker)}
        />
      </div>

      {stocks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>Your watchlist is empty. Add stocks to get started.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {stocks.map((stock) => (
            <StockCard 
              key={stock.ticker} 
              stock={stock} 
              onRemove={onRemoveStock}
            />
          ))}
        </div>
      )}
    </section>
  )
}
