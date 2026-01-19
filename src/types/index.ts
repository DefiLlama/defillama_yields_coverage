export interface Protocol {
  id: string
  name: string
  address: string | null
  symbol: string
  url: string
  description: string
  chain: string
  logo: string
  audits: string
  audit_note: string | null
  gecko_id: string | null
  cmcId: string | null
  category: string
  chains: string[]
  module: string
  twitter: string | null
  forkedFrom: string[]
  listedAt: number | null
  methodology: string
  misrepresentedTokens: boolean
  slug: string
  tvl: number
  chainTvls: Record<string, number>
  change_1h: number | null
  change_1d: number | null
  change_7d: number | null
  mcap: number | null
  parentProtocol?: string
  parentProtocolSlug?: string
}

export interface Pool {
  chain: string
  project: string
  symbol: string
  tvlUsd: number
  apyBase: number | null
  apyReward: number | null
  apy: number
  rewardTokens: string[] | null
  pool: string
  apyPct1D: number | null
  apyPct7D: number | null
  apyPct30D: number | null
  stablecoin: boolean
  ilRisk: string
  exposure: string
  predictions: {
    predictedClass: string | null
    predictedProbability: number | null
    binnedConfidence: number | null
  }
  poolMeta: string | null
  underlyingTokens: string[] | null
}

export interface PoolsResponse {
  status: string
  data: Pool[]
}

export interface GitHubTreeItem {
  path: string
  mode: string
  type: string
  sha: string
  size?: number
  url: string
}

export interface GitHubTreeResponse {
  sha: string
  url: string
  tree: GitHubTreeItem[]
  truncated: boolean
}

export interface YieldAdapter {
  path: string
  slug: string
}

export interface EnrichedProtocol extends Protocol {
  hasYieldAdapter: boolean
}

export interface FilterState {
  search: string
  chains: string[]
  categories: string[]
  sort: string
  showOnlyMissing: boolean
  showOnlyYieldRelevant: boolean
  minTvl: number
}

