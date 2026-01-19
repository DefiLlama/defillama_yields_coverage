import { useQuery } from "@tanstack/react-query"
import type { GitHubTreeResponse, YieldAdapter } from "@/types"

async function fetchYieldAdapters(): Promise<YieldAdapter[]> {
  const response = await fetch(
    "https://api.github.com/repos/DefiLlama/yield-server/git/trees/master?recursive=1"
  )
  if (!response.ok) {
    throw new Error("Failed to fetch yield adapters from GitHub")
  }
  
  const data: GitHubTreeResponse = await response.json()
  
  // Filter for adapter index files and extract slugs
  const adapters = data.tree
    .filter(
      (item) =>
        item.path.includes("src/adaptors/") &&
        (item.path.endsWith("index.js") || item.path.endsWith("index.ts"))
    )
    .map((item) => {
      // Extract slug from path like "src/adaptors/aave-v3/index.js"
      const parts = item.path.split("/")
      const slug = parts[2] // Get the adapter folder name
      return {
        path: item.path,
        slug,
      }
    })
  
  return adapters
}

export function useAdapters() {
  return useQuery({
    queryKey: ["yield-adapters"],
    queryFn: fetchYieldAdapters,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  })
}

export function useAdapterSlugs() {
  const { data: adapters, ...rest } = useAdapters()
  
  return {
    ...rest,
    data: adapters ? new Set(adapters.map((a) => a.slug)) : new Set<string>(),
  }
}

