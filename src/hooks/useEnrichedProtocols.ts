import { useMemo } from "react"
import { useProtocols } from "./useProtocols"
import { usePools } from "./usePools"
import { useAdapterSlugs } from "./useAdapters"
import { EXCLUDED_CATEGORIES } from "@/lib/constants"
import type { EnrichedProtocol, FilterState } from "@/types"

export function useEnrichedProtocols(filters: FilterState) {
  const { data: protocols, isLoading: protocolsLoading, error: protocolsError } = useProtocols()
  const { data: pools, isLoading: poolsLoading } = usePools()
  const { data: adapterSlugs, isLoading: adaptersLoading } = useAdapterSlugs()

  const isLoading = protocolsLoading || poolsLoading || adaptersLoading

  // Get unique projects from pools as additional check for yield adapters
  const poolProjects = useMemo(() => {
    if (!pools) return new Set<string>()
    return new Set(pools.map((pool) => pool.project))
  }, [pools])

  // Enrich protocols with yield adapter info
  const enrichedProtocols = useMemo(() => {
    if (!protocols) return []

    return protocols
      .filter((protocol) => !EXCLUDED_CATEGORIES.includes(protocol.category as never))
      .map((protocol): EnrichedProtocol => ({
        ...protocol,
        hasYieldAdapter: adapterSlugs.has(protocol.slug) || poolProjects.has(protocol.slug),
      }))
  }, [protocols, adapterSlugs, poolProjects])

  // Extract unique chains and categories for filters
  const { allChains, allCategories } = useMemo(() => {
    const chains = new Set<string>()
    const categories = new Set<string>()

    enrichedProtocols.forEach((protocol) => {
      if (protocol.category) categories.add(protocol.category)
      protocol.chains?.forEach((chain) => chains.add(chain))
    })

    return {
      allChains: Array.from(chains).sort(),
      allCategories: Array.from(categories).sort(),
    }
  }, [enrichedProtocols])

  // Apply filters and sorting
  const filteredProtocols = useMemo(() => {
    let result = [...enrichedProtocols]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower) ||
          p.slug.toLowerCase().includes(searchLower)
      )
    }

    // Chain filter
    if (filters.chains.length > 0) {
      result = result.filter((p) =>
        filters.chains.some((chain) => p.chains?.includes(chain))
      )
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category))
    }

    // TVL filter
    if (filters.minTvl > 0) {
      result = result.filter((p) => (p.tvl ?? 0) >= filters.minTvl)
    }

    // Show only missing adapters
    if (filters.showOnlyMissing) {
      result = result.filter((p) => !p.hasYieldAdapter)
    }

    // Sorting
    const [sortField, sortDirection] = filters.sort.split("-") as [string, "asc" | "desc"]
    result.sort((a, b) => {
      let comparison = 0
      
      switch (sortField) {
        case "listedAt":
          comparison = (b.listedAt ?? 0) - (a.listedAt ?? 0)
          break
        case "tvl":
          comparison = (b.tvl ?? 0) - (a.tvl ?? 0)
          break
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        default:
          comparison = 0
      }

      return sortDirection === "asc" ? -comparison : comparison
    })

    return result
  }, [enrichedProtocols, filters])

  // Get filtered pool projects based on current filters
  const filteredPoolProjects = useMemo(() => {
    if (!pools) return new Set<string>()
    
    // Get the slugs of protocols that match the current filters
    const filteredSlugs = new Set(filteredProtocols.map((p) => p.slug))
    
    // Filter pools to only include those from filtered protocols
    return new Set(
      pools
        .filter((pool) => filteredSlugs.has(pool.project))
        .map((pool) => pool.project)
    )
  }, [pools, filteredProtocols])

  // Stats - now based on filtered protocols
  const stats = useMemo(() => {
    const covered = filteredProtocols.filter((p) => p.hasYieldAdapter).length
    const total = filteredProtocols.length
    
    // Filter pools based on filtered protocols
    const filteredSlugs = new Set(filteredProtocols.map((p) => p.slug))
    const relevantPools = pools?.filter((pool) => filteredSlugs.has(pool.project)) ?? []
    
    const poolsTvl = relevantPools.reduce((acc, pool) => acc + pool.tvlUsd, 0)
    const poolsCount = relevantPools.length
    const poolsOver1M = relevantPools.filter((p) => p.tvlUsd > 1_000_000).length
    const uniqueProjects = filteredPoolProjects.size

    return {
      covered,
      total,
      poolsTvl,
      poolsCount,
      poolsOver1M,
      uniqueProjects,
    }
  }, [filteredProtocols, pools, filteredPoolProjects])

  return {
    protocols: filteredProtocols,
    allChains,
    allCategories,
    stats,
    isLoading,
    error: protocolsError,
  }
}
