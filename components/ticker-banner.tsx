'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'

type TickerItem = {
  ticker: string
  price: number
  change: number
  changePercent: number
}

const tickerData: TickerItem[] = [
  { ticker: 'AAPL', price: 178.45, change: 2.34, changePercent: 1.33 },
  { ticker: 'TSLA', price: 242.15, change: -4.67, changePercent: -1.89 },
  { ticker: 'GOOGL', price: 142.89, change: 0.45, changePercent: 0.32 },
  { ticker: 'MSFT', price: 412.34, change: 5.89, changePercent: 1.45 },
  { ticker: 'AMZN', price: 178.32, change: 3.21, changePercent: 1.83 },
  { ticker: 'NVDA', price: 495.67, change: -8.45, changePercent: -1.68 },
  { ticker: 'META', price: 512.89, change: 12.34, changePercent: 2.46 },
  { ticker: 'NFLX', price: 623.45, change: -5.67, changePercent: -0.90 },
  { ticker: 'AMD', price: 156.78, change: 4.23, changePercent: 2.77 },
  { ticker: 'INTC', price: 43.21, change: -0.89, changePercent: -2.02 },
]

export function TickerBanner() {
  // Duplicate the data for seamless loop
  const duplicatedData = [...tickerData, ...tickerData]

  return (
    <div className="border-b bg-card/50 backdrop-blur-sm overflow-hidden relative">
      <div className="flex animate-scroll">
        {duplicatedData.map((item, index) => (
          <div
            key={`${item.ticker}-${index}`}
            className="flex items-center gap-3 px-6 py-3 whitespace-nowrap border-r border-border/50"
          >
            <span className="font-bold text-sm">{item.ticker}</span>
            <span className="text-sm font-medium">${item.price.toFixed(2)}</span>
            <div
              className={`flex items-center gap-1 text-xs font-medium ${
                item.change >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {item.change >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>
                {item.change >= 0 ? '+' : ''}
                {item.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Gradient overlays for smooth edges */}
      <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-card/50 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-card/50 to-transparent pointer-events-none" />
    </div>
  )
}
