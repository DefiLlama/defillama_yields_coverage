import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

interface MultiSelectProps {
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  highlightedOptions?: string[]
  emptyMessage?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select...",
  highlightedOptions = [],
  emptyMessage = "No options found.",
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const highlightedSet = new Set(highlightedOptions)

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(selected.filter((item) => item !== value))
  }

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange([])
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-[180px] justify-between h-auto min-h-9 px-3"
        >
          <div className="flex flex-wrap gap-1 items-center">
            {selected.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : selected.length <= 2 ? (
              selected.map((item) => (
                <Badge
                  key={item}
                  variant={highlightedSet.has(item) ? "default" : "secondary"}
                  className="text-xs px-1.5 py-0"
                >
                  {item}
                  <button
                    className="ml-1 hover:text-destructive"
                    onClick={(e) => handleRemove(item, e)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            ) : (
              <Badge variant="secondary" className="text-xs">
                {selected.length} selected
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 ml-2">
            {selected.length > 0 && (
              <button
                className="hover:text-destructive"
                onClick={handleClearAll}
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            {highlightedOptions.length > 0 && (
              <CommandGroup heading="Yield Relevant">
                {options
                  .filter((option) => highlightedSet.has(option))
                  .map((option) => (
                    <CommandItem
                      key={option}
                      value={option}
                      onSelect={() => handleSelect(option)}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          selected.includes(option)
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <Check className="h-4 w-4" />
                      </div>
                      <span className="text-primary-foreground">{option}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            )}
            <CommandGroup heading={highlightedOptions.length > 0 ? "Other" : "All"}>
              {options
                .filter((option) => !highlightedSet.has(option))
                .map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => handleSelect(option)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        selected.includes(option)
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className="h-4 w-4" />
                    </div>
                    {option}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

