// Categories that typically need yield adapters
// These will be highlighted in the category filter
// Based on analysis of existing yield adapters and DeFi Llama categories
export const YIELD_RELEVANT_CATEGORIES = [
  "Lending",
  "Liquid Staking",
  "Dexes",
  "Yield",
  "Yield Aggregator",
  "Farm",
  "CDP",
  "RWA",
  "RWA Lending",
  "Liquid Restaking",
  "Restaking",
  "Derivatives",
  "Liquidity manager",
  "Liquidity Automation",
  "Leveraged Farming",
  "NFT Lending",
  "Staking Pool",
  "Options",
  "Options Vault",
  "Synthetics",
  "Algo-Stables",
  "Stablecoin",
  "Reserve Currency",
  "Basis Trading",
  "Prediction Market",
  "Indexes",
  "Uncollateralized Lending",
  "Restaked BTC",
  "Decentralized BTC",
  "Anchor BTC",
] as const

// Categories to exclude from the list (not relevant for yield adapters)
export const EXCLUDED_CATEGORIES = [
  "Chain",
  "Bridge",
  "CEX",
] as const

export const SORT_OPTIONS = [
  { value: "listedAt-desc", label: "Recently Added" },
  { value: "tvl-desc", label: "TVL (High to Low)" },
  { value: "tvl-asc", label: "TVL (Low to High)" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
] as const

export type SortOption = typeof SORT_OPTIONS[number]["value"]

