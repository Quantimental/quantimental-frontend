# Quantimental Frontend

> **Gradient purple perfection meets radical simplicity.**

## Overview

The Quantimental frontend is a React 18 application built with TypeScript, Tailwind CSS, and Framer Motion. It delivers institutional-grade market intelligence with consumer-app simplicity.

## Design Philosophy

**"Every retail investor deserves to know what institutional traders see—delivered in plain English, on their phone, with one-tap clarity."**

### Design Principles

1. **Radical Simplicity** — One glance. One signal. One decision.
2. **Confidence Over Certainty** — Show probabilities, not guarantees.
3. **Education Through Use** — Learn by doing, not reading docs.
4. **Respectful Intelligence** — No dark patterns, no hype bait.

### Gradient Purple Design System

- **Primary Gradient:** Deep purple (#6b21a8) → Bright purple (#a855f7) → Electric purple (#c084fc)
- **Dark Mode First:** Financial apps belong in the dark
- **Glass-morphism:** Frosted glass cards with backdrop blur
- **Signal Colors:** 🟢 Emerald · 🟡 Amber · 🔴 Rose

## Tech Stack

- **React 18** — Modern hooks, concurrent features
- **TypeScript** — Type safety across the stack
- **Tailwind CSS** — Utility-first styling, gradient magic
- **Framer Motion** — Buttery smooth animations
- **React Query** — Server state management
- **React Router** — Client-side routing
- **Recharts** — Beautiful, declarative charts
- **Lucide Icons** — Clean, consistent icons
- **Vite** — Lightning-fast dev server & build

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Feed/              # Signal feed screen
│   │   │   └── SignalFeed.tsx
│   │   ├── StockDetail/       # Stock detail screen (coming soon)
│   │   ├── Watchlist/         # Watchlist screen (coming soon)
│   │   └── shared/            # Reusable components
│   │       ├── SignalBadge.tsx
│   │       └── ConfidenceMeter.tsx
│   ├── hooks/                 # Custom React hooks
│   ├── services/              # API client
│   │   └── api.ts
│   ├── types/                 # TypeScript definitions
│   │   └── api.ts
│   ├── styles/                # Global styles
│   │   └── index.css
│   ├── App.tsx                # Main app component
│   └── main.tsx               # Entry point
├── public/                    # Static assets
├── index.html                 # HTML template
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── tailwind.config.js         # Design system
├── vite.config.ts             # Vite config
└── README.md                  # You are here
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. **Install dependencies:**
   ```bash
   cd quantimental-frontend
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # Create .env file
   echo "VITE_API_URL=http://localhost:8000/api/v1" > .env
   ```

3. **Start dev server:**
   ```bash
   npm run dev
   ```

   App will be available at **http://localhost:3000**

4. **Make sure backend is running:**
   ```bash
   cd ../quantimental-backend
   python -m app.main
   ```

## Development

### Available Scripts

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

### Code Style

- **TypeScript** — Strict mode enabled
- **Prettier** — Auto-formatting on save
- **ESLint** — React + TypeScript rules
- **Tailwind** — Utility classes only (no custom CSS unless necessary)

### Component Guidelines

1. **File Structure:**
   ```typescript
   // ComponentName.tsx
   import { useState } from 'react';
   import type { Props } from '@/types';

   export function ComponentName({ prop }: Props) {
     // Logic
     return (
       // JSX
     );
   }

   export default ComponentName;
   ```

2. **Naming Conventions:**
   - Components: `PascalCase`
   - Files: `PascalCase.tsx`
   - Functions: `camelCase`
   - Constants: `UPPER_SNAKE_CASE`

3. **Styling:**
   - Use Tailwind utility classes
   - Extract repeated patterns to `index.css` (e.g., `.glass-card`)
   - Use `clsx()` for conditional classes

4. **Type Safety:**
   - Import types from `@/types/api.ts`
   - No `any` types (use `unknown` and narrow)
   - Explicit return types for functions

## The Three Core Screens

### 1. Signal Feed (Implemented ✅)
- **Purpose:** Home screen, show all signals
- **Features:**
  - Color-coded signal badges
  - Confidence meters
  - Filters (signal type, confidence threshold)
  - Real-time updates every 60s
  - Pagination
- **File:** `src/components/Feed/SignalFeed.tsx`

### 2. Stock Detail (Coming Soon)
- **Purpose:** Deep dive into single stock
- **Features:**
  - Current signal with confidence
  - Quant data (RSI, MAs, trends)
  - Psych data (sentiment, emotion, hype)
  - Plain-English "why" explanation
  - Interactive price chart with signal markers
  - Historical accuracy stats
  - Add to watchlist button
- **File:** `src/components/StockDetail/StockDetail.tsx`

### 3. Watchlist (Coming Soon)
- **Purpose:** Personal command center
- **Features:**
  - Personalized stock list
  - Real-time signal updates
  - Signal change badges
  - Drag-to-reorder
  - Swipe-to-delete
- **File:** `src/components/Watchlist/Watchlist.tsx`

## Shared Components

### SignalBadge
```tsx
<SignalBadge signal="STRONG_BUY" size="md" showIcon={true} />
```

### ConfidenceMeter
```tsx
<ConfidenceMeter
  confidence={0.88}
  showPercentage={true}
  size="md"
  animated={true}
/>
```

## API Integration

All API calls go through `src/services/api.ts`:

```typescript
import { signalsAPI, watchlistAPI } from '@/services/api';

// Get signal feed
const feed = await signalsAPI.getFeed({ min_confidence: 0.8 });

// Get stock detail
const stock = await signalsAPI.getStockDetail('AAPL');

// Add to watchlist
await watchlistAPI.add('AAPL');
```

## Performance Targets

- **First Contentful Paint:** <1.5s
- **Time to Interactive:** <3s
- **Bundle Size:** <500KB (gzipped)
- **Lighthouse Score:** >90

## Deployment

### Production Build

```bash
npm run build
# Output: dist/
```

### Environment Variables

```env
VITE_API_URL=https://api.quantimental.com/api/v1
```

### Hosting Options

- **Vercel** (recommended) — Zero-config React deployments
- **Netlify** — Great for static sites + serverless functions
- **Cloudflare Pages** — Edge-first, global CDN
- **Railway** — Simple, Docker-based

## Roadmap

### MVP (v1.0) — Current
- [x] Design system (gradient purple)
- [x] Signal feed screen
- [x] Shared components (SignalBadge, ConfidenceMeter)
- [x] API integration
- [ ] Stock detail screen
- [ ] Watchlist screen
- [ ] Search functionality

### v1.1 — Enhancement
- [ ] Onboarding flow (≤ 2 minutes)
- [ ] Push notifications
- [ ] Historical signal browser
- [ ] Dark/light mode toggle
- [ ] Mobile responsive design

### v2.0 — Real-Time
- [ ] WebSocket integration
- [ ] Live signal updates
- [ ] Real-time price charts
- [ ] Notification center

### v3.0 — Mobile
- [ ] React Native app (iOS/Android)
- [ ] Native push notifications
- [ ] Biometric authentication
- [ ] Offline mode

## Design Inspiration

- **WealthSimple** — Consumer fintech done right
- **Linear** — Beautiful B2B SaaS UI
- **Apple** — Attention to detail, respect for users
- **Stripe** — Gradient mastery

## Philosophy

> "The best products don't just solve problems—they feel inevitable in hindsight."

This frontend embodies that principle. Every component, every animation, every color choice serves the user's need to understand market signals quickly and confidently.

---

**Built with ❤️ and gradient purple for retail investors who deserve better.**
