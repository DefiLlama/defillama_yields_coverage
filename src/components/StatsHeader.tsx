import { TrendingUp, Layers, DollarSign, Award } from "lucide-react"
import { formatNumber } from "@/lib/utils"

interface Stats {
  covered: number
  total: number
  poolsTvl: number
  poolsCount: number
  poolsOver1M: number
  uniqueProjects: number
}

interface StatsHeaderProps {
  stats: Stats
  isLoading?: boolean
}

export function StatsHeader({ stats, isLoading }: StatsHeaderProps) {
  const coveragePercent = stats.total > 0 
    ? ((stats.covered / stats.total) * 100).toFixed(1) 
    : "0"

  const statCards = [
    {
      label: "Protocols Covered",
      value: `${stats.uniqueProjects}`,
      subtext: `${coveragePercent}% of ${stats.total} protocols`,
      icon: TrendingUp,
      color: "text-success",
    },
    {
      label: "Total Pools",
      value: stats.poolsCount.toLocaleString(),
      subtext: "Yield pools tracked",
      icon: Layers,
      color: "text-primary",
    },
    {
      label: "Pools TVL",
      value: `$${formatNumber(stats.poolsTvl)}`,
      subtext: "Total value locked",
      icon: DollarSign,
      color: "text-warning",
    },
    {
      label: "$1M+ Pools",
      value: stats.poolsOver1M.toLocaleString(),
      subtext: "High-value pools",
      icon: Award,
      color: "text-accent",
    },
  ]

  return (
    <div className="border-b border-border bg-gradient-to-b from-secondary/30 to-transparent">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            DeFi Llama Yield Adapters
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover protocols that need yield adapters and track coverage
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30"
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  {stat.label}
                </span>
              </div>
              {isLoading ? (
                <div className="h-8 w-24 bg-secondary animate-pulse rounded" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stat.subtext}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

