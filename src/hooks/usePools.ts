import { useQuery } from "@tanstack/react-query"
import type { PoolsResponse } from "@/types"

async function fetchPools(): Promise<PoolsResponse> {
  const response = await fetch("https://yields.llama.fi/pools")
  if (!response.ok) {
    throw new Error("Failed to fetch pools")
  }
  return response.json()
}

export function usePools() {
  return useQuery({
    queryKey: ["pools"],
    queryFn: fetchPools,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    select: (data) => data.data,
  })
}

