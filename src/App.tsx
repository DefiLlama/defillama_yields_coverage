import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { LayoutGrid, List, Loader2 } from "lucide-react"
import { useEnrichedProtocols } from "@/hooks"
import { FilterBar } from "@/components/filters"
import { StatsHeader } from "@/components/StatsHeader"
import { ProtocolCard } from "@/components/ProtocolCard"
import { ProtocolTable } from "@/components/ProtocolTable"
import { Button } from "@/components/ui/button"
import type { FilterState } from "@/types"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
})

const DEFAULT_FILTERS: FilterState = {
  search: "",
  chains: [],
  categories: [],
  sort: "listedAt-desc",
  showOnlyMissing: false,
  showOnlyYieldRelevant: false,
  minTvl: 500000,
}

function YieldAdapterFinder() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [viewMode, setViewMode] = useState<"grid" | "table">("table")
  const [displayCount, setDisplayCount] = useState(50)

  const { protocols, allChains, allCategories, stats, isLoading, error } =
    useEnrichedProtocols(filters)

  const displayedProtocols = protocols.slice(0, displayCount)
  const hasMore = protocols.length > displayCount

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 50)
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive mb-2">
            Failed to load data
          </h2>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : "Unknown error occurred"}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark">
      <StatsHeader stats={stats} isLoading={isLoading} />

      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        allChains={allChains}
        allCategories={allCategories}
      />

      <main className="container mx-auto px-4 py-6">
        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-lg font-medium">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading protocols...
                </span>
              ) : (
                <>
                  {protocols.length.toLocaleString()} protocol
                  {protocols.length !== 1 ? "s" : ""} found
                </>
              )}
            </span>
            {!isLoading && filters.showOnlyMissing && (
              <span className="text-sm text-muted-foreground ml-2">
                (missing yield adapters)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              title="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("table")}
              title="Table view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-card p-4 animate-pulse"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-secondary" />
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-secondary rounded mb-2" />
                    <div className="h-3 w-16 bg-secondary rounded" />
                  </div>
                </div>
                <div className="h-3 w-full bg-secondary rounded mb-2" />
                <div className="h-3 w-3/4 bg-secondary rounded mb-3" />
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="h-12 bg-secondary rounded" />
                  <div className="h-12 bg-secondary rounded" />
                </div>
                <div className="flex gap-1">
                  <div className="h-5 w-16 bg-secondary rounded" />
                  <div className="h-5 w-16 bg-secondary rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        {!isLoading && (
          <>
            {protocols.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No protocols match your filters
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                >
                  Clear filters
                </Button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayedProtocols.map((protocol) => (
                  <ProtocolCard key={protocol.id} protocol={protocol} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <ProtocolTable protocols={displayedProtocols} />
              </div>
            )}

            {/* Load more */}
            {hasMore && (
              <div className="text-center mt-8">
                <Button variant="outline" onClick={handleLoadMore}>
                  Load more ({protocols.length - displayCount} remaining)
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Data sourced from{" "}
            <a
              href="https://defillama.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              DefiLlama
            </a>
            . Yield adapter status from{" "}
            <a
              href="https://github.com/DefiLlama/yield-server"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              yield-server repository
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YieldAdapterFinder />
    </QueryClientProvider>
  )
}

export default App
