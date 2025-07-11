"use client"

import * as React from "react"
import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onSearch?: (value: string) => void
  searchValue?: string
  searchPlaceholder?: string
  filters?: React.ReactNode
  viewOptions?: React.ReactNode
}

export function DataTableToolbar<TData>({
  table,
  onSearch,
  searchValue = "",
  searchPlaceholder = "Buscar...",
  filters,
  viewOptions,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {onSearch && (
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(event) => {
              onSearch(event.target.value)
            }}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        {filters}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Limpiar
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {viewOptions || <DataTableViewOptions table={table} />}
    </div>
  )
} 