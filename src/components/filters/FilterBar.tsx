import { SearchInput } from "./SearchInput"
import { MultiSelect } from "./MultiSelect"
import { SortSelect } from "./SortSelect"
import { TvlFilter } from "./TvlFilter"
import { Switch } from "@/components/ui/switch"
import { YIELD_RELEVANT_CATEGORIES } from "@/lib/constants"
import type { FilterState } from "@/types"

interface FilterBarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  allChains: string[]
  allCategories: string[]
}

export function FilterBar({
  filters,
  onFiltersChange,
  allChains,
  allCategories,
}: FilterBarProps) {
  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center gap-4">
          <SearchInput
            value={filters.search}
            onChange={(value) => updateFilter("search", value)}
            placeholder="Search by name or description..."
            className="w-full sm:w-[300px]"
          />

          <MultiSelect
            options={allChains}
            selected={filters.chains}
            onChange={(value) => updateFilter("chains", value)}
            placeholder="Chains"
            emptyMessage="No chains found."
          />

          <MultiSelect
            options={allCategories}
            selected={filters.categories}
            onChange={(value) => updateFilter("categories", value)}
            placeholder="Categories"
            highlightedOptions={YIELD_RELEVANT_CATEGORIES.filter((c) =>
              allCategories.includes(c)
            )}
            emptyMessage="No categories found."
          />

          <TvlFilter
            value={filters.minTvl}
            onChange={(value) => updateFilter("minTvl", value)}
          />

          <SortSelect
            value={filters.sort}
            onChange={(value) => updateFilter("sort", value)}
          />

          <div className="flex items-center gap-2 ml-auto">
            <label
              htmlFor="missing-only"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Missing adapters only
            </label>
            <Switch
              id="missing-only"
              checked={filters.showOnlyMissing}
              onCheckedChange={(checked) =>
                updateFilter("showOnlyMissing", checked)
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

