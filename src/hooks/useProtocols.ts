import { useQuery } from "@tanstack/react-query"
import type { Protocol } from "@/types"

async function fetchProtocols(): Promise<Protocol[]> {
  const response = await fetch("https://api.llama.fi/protocols")
  if (!response.ok) {
    throw new Error("Failed to fetch protocols")
  }
  return response.json()
}

export function useProtocols() {
  return useQuery({
    queryKey: ["protocols"],
    queryFn: fetchProtocols,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  })
}

