"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Column } from "@tanstack/react-table"
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

interface DataTableDropdownFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title: string
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  data: any[]
  loading?: boolean
  valueKey: string
  labelKey: string
  value: string
  onValueChange: (value: string) => void
  className?: string
  width?: string
  showAllOption?: boolean
  allOptionLabel?: string
  allOptionValue?: string
}

export function DataTableDropdownFacetedFilter<TData, TValue>({
  column,
  title,
  placeholder = "Seleccionar...",
  searchPlaceholder = "Buscar...",
  emptyMessage = "No se encontraron resultados.",
  data,
  loading = false,
  valueKey,
  labelKey,
  value,
  onValueChange,
  className = "min-w-[220px]",
  width = "w-[220px]",
  showAllOption = true,
  allOptionLabel = "Todos",
  allOptionValue = "",
}: DataTableDropdownFacetedFilterProps<TData, TValue>) {
  const [open, setOpen] = React.useState(false)



  // Get the selected item's label
  const getSelectedLabel = () => {
    if (!value) return placeholder
    const selectedItem = data.find(item => item[valueKey] === value)
    return selectedItem ? selectedItem[labelKey] : placeholder
  }

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue)
    // Set the column filter value for table integration
    if (column) {
      column.setFilterValue(selectedValue || undefined)
    }
    setOpen(false)
  }

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-full h-8 justify-between ${loading ? 'opacity-50' : ''}`}
            disabled={loading}
          >
            {loading ? "Cargando..." : getSelectedLabel()}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={`${width} p-0`}>
          <Command>
            <CommandInput placeholder={searchPlaceholder} className="h-9" />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {showAllOption && (
                  <CommandItem
                    key={allOptionValue}
                    value={allOptionValue}
                    onSelect={() => handleSelect(allOptionValue)}
                  >
                    {allOptionLabel}
                    <Check 
                      className={value === allOptionValue ? "ml-auto opacity-100" : "ml-auto opacity-0"} 
                    />
                  </CommandItem>
                )}
                {data.map((item) => (
                  <CommandItem
                    key={item[valueKey]}
                    value={item[labelKey]}
                    onSelect={() => handleSelect(item[valueKey])}
                  >
                    {item[labelKey]}
                    <Check 
                      className={value === item[valueKey] ? "ml-auto opacity-100" : "ml-auto opacity-0"} 
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
