# DeFi Llama Yield Adapter Finder

A modern React application to discover DeFi protocols that need yield adapters for DeFi Llama.

## Features

- **Search** - Filter protocols by name or description
- **Chain Filter** - Multi-select filter to find protocols on specific chains
- **Category Filter** - Filter by category with yield-relevant categories highlighted (Lending, Liquid Staking, DEXs, Yield, Farm, CDP, RWA, Options, Derivatives, etc.)
- **TVL Filter** - Filter out small protocols by minimum TVL ($100K, $500K, $1M, $5M, $10M, $50M, $100M+)
- **Sort** - Sort by recently added, TVL (high/low), or name
- **Adapter Status** - Toggle to show only protocols missing yield adapters
- **Grid/Table View** - Switch between card grid and table views
- **Stats Dashboard** - Track coverage metrics including protocols covered, pools, and TVL
- **DeFi Llama Integration** - Protocol links go directly to DeFi Llama protocol pages

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** for fast development and builds
- **TanStack Query** for data fetching and caching
- **Tailwind CSS 4** for styling
- **shadcn/ui** + **Radix UI** for accessible components
- **Lucide React** for icons

## Data Sources

- [DeFi Llama Protocols API](https://api.llama.fi/protocols) - Protocol data with TVL, categories, chains
- [DeFi Llama Yields API](https://yields.llama.fi/pools) - Yield pools data
- [GitHub yield-server](https://github.com/DefiLlama/yield-server) - Existing yield adapters

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Usage

1. **Finding protocols without adapters**: Toggle "Missing adapters only" to filter to protocols that don't have yield adapters yet.

2. **Focus on yield-relevant categories**: In the category filter, categories like Lending, Liquid Staking, DEXs, Options, Derivatives are highlighted as they typically need yield adapters.

3. **Filter by TVL**: Use the TVL filter to focus on protocols with significant value locked. For example, select "$1M+" to only see protocols with over $1M TVL.

4. **Discover new protocols**: Sort by "Recently Added" to find newly listed protocols that may need adapters.

5. **Filter by chain**: Use the chain filter to focus on specific blockchains.

6. **View on DeFi Llama**: Click any protocol name to view its full page on DeFi Llama with detailed metrics.

## Contributing

This tool helps identify protocols that need yield adapters for DeFi Llama. If you'd like to contribute an adapter:

1. Check the [yield-server repository](https://github.com/DefiLlama/yield-server)
2. Follow the adapter guidelines in the repository
3. Submit a PR with your new adapter

## Licence

MIT
