import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TvlFilterProps {
  value: number
  onChange: (value: number) => void
}

const TVL_OPTIONS = [
  { value: 0, label: "All TVL" },
  { value: 100_000, label: "$100K+" },
  { value: 500_000, label: "$500K+" },
  { value: 1_000_000, label: "$1M+" },
  { value: 5_000_000, label: "$5M+" },
  { value: 10_000_000, label: "$10M+" },
  { value: 50_000_000, label: "$50M+" },
  { value: 100_000_000, label: "$100M+" },
] as const

export function TvlFilter({ value, onChange }: TvlFilterProps) {
  return (
    <Select value={value.toString()} onValueChange={(v) => onChange(Number(v))}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Min TVL" />
      </SelectTrigger>
      <SelectContent>
        {TVL_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value.toString()}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

