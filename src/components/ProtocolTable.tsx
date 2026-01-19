import { ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatNumber, getRelativeTime } from "@/lib/utils"
import { YIELD_RELEVANT_CATEGORIES } from "@/lib/constants"
import type { EnrichedProtocol } from "@/types"

interface ProtocolTableProps {
  protocols: EnrichedProtocol[]
}

const yieldRelevantSet = new Set(YIELD_RELEVANT_CATEGORIES)

export function ProtocolTable({ protocols }: ProtocolTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="py-3 pl-4 font-medium text-muted-foreground">Protocol</th>
            <th className="py-3 font-medium text-muted-foreground">Category</th>
            <th className="py-3 font-medium text-muted-foreground text-right">TVL</th>
            <th className="py-3 font-medium text-muted-foreground">Chains</th>
            <th className="py-3 font-medium text-muted-foreground">Added</th>
            <th className="py-3 pr-4 font-medium text-muted-foreground text-center">Yield Adapter</th>
          </tr>
        </thead>
        <tbody>
          {protocols.map((protocol) => {
            const isYieldRelevant = yieldRelevantSet.has(protocol.category as never)
            const topChains = protocol.chains?.slice(0, 3) ?? []
            const remainingChains = (protocol.chains?.length ?? 0) - 3

            return (
              <tr
                key={protocol.id}
                className="border-b border-border/50 transition-colors hover:bg-secondary/30"
              >
                {/* Protocol */}
                <td className="py-3 pl-4">
                  <div className="flex items-center gap-3">
                    {protocol.logo ? (
                      <img
                        src={protocol.logo}
                        alt={protocol.name}
                        className="h-8 w-8 rounded-full bg-secondary object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                        }}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                        <div className="text-xs text-muted-foreground">{protocol.name.charAt(0)}</div>
                      </div>
                    )}
                    <div>
                      <a
                        href={`https://defillama.com/protocol/${protocol.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-foreground hover:text-primary flex items-center gap-1"
                      >
                        {protocol.name}
                        <ExternalLink className="h-3 w-3 opacity-50" />
                      </a>
                      {protocol.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-xs">
                          {protocol.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="py-3">
                  <Badge
                    variant={isYieldRelevant ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {protocol.category}
                  </Badge>
                </td>

                {/* TVL */}
                <td className="py-3 text-right font-mono text-sm">
                  ${formatNumber(protocol.tvl)}
                </td>

                {/* Chains */}
                <td className="py-3">
                  <div className="flex flex-wrap gap-1">
                    {topChains.map((chain) => (
                      <Badge key={chain} variant="outline" className="text-xs">
                        {chain}
                      </Badge>
                    ))}
                    {remainingChains > 0 && (
                      <Badge variant="outline" className="text-xs">
                        +{remainingChains}
                      </Badge>
                    )}
                  </div>
                </td>

                {/* Added */}
                <td className="py-3 text-sm text-muted-foreground">
                  {getRelativeTime(protocol.listedAt)}
                </td>

                {/* Yield Adapter */}
                <td className="py-3 pr-4 text-center">
                  <Badge
                    variant={protocol.hasYieldAdapter ? "success" : "destructive"}
                    className="text-xs"
                  >
                    {protocol.hasYieldAdapter ? "YES" : "NO"}
                  </Badge>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

