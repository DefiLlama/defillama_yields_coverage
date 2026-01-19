import { ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatNumber, getRelativeTime } from "@/lib/utils"
import { YIELD_RELEVANT_CATEGORIES } from "@/lib/constants"
import type { EnrichedProtocol } from "@/types"

interface ProtocolCardProps {
  protocol: EnrichedProtocol
}

const yieldRelevantSet = new Set(YIELD_RELEVANT_CATEGORIES)

export function ProtocolCard({ protocol }: ProtocolCardProps) {
  const isYieldRelevant = yieldRelevantSet.has(protocol.category as never)
  const topChains = protocol.chains?.slice(0, 3) ?? []
  const remainingChains = (protocol.chains?.length ?? 0) - 3

  return (
    <div className="group relative rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {protocol.logo ? (
          <img
            src={protocol.logo}
            alt={protocol.name}
            className="h-10 w-10 rounded-full bg-secondary object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none"
            }}
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
            <div className="text-xs text-muted-foreground">{protocol.name.charAt(0)}</div>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <a
              href={`https://defillama.com/protocol/${protocol.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:text-primary truncate flex items-center gap-1"
            >
              {protocol.name}
              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge
              variant={isYieldRelevant ? "default" : "secondary"}
              className="text-xs"
            >
              {protocol.category}
            </Badge>
            <Badge
              variant={protocol.hasYieldAdapter ? "success" : "destructive"}
              className="text-xs"
            >
              {protocol.hasYieldAdapter ? "Yield Adapter" : "No Adapter"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Description */}
      {protocol.description && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {protocol.description}
        </p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="rounded-md bg-secondary/50 px-3 py-2">
          <div className="text-xs text-muted-foreground">TVL</div>
          <div className="text-sm font-medium">${formatNumber(protocol.tvl)}</div>
        </div>
        <div className="rounded-md bg-secondary/50 px-3 py-2">
          <div className="text-xs text-muted-foreground">Added</div>
          <div className="text-sm font-medium">{getRelativeTime(protocol.listedAt)}</div>
        </div>
      </div>

      {/* Chains */}
      {topChains.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {topChains.map((chain) => (
            <Badge key={chain} variant="outline" className="text-xs">
              {chain}
            </Badge>
          ))}
          {remainingChains > 0 && (
            <Badge variant="outline" className="text-xs">
              +{remainingChains} more
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}

