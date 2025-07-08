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
}

export function DataTableToolbar<TData>({
  table,
  onSearch,
  searchValue = "",
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Buscar aplicaciones..."
          value={searchValue}
          onChange={(event) => {
            onSearch?.(event.target.value)
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("programType") && (
          <DataTableFacetedFilter
            column={table.getColumn("programType")}
            title="Tipo de Programa"
            options={[
              {
                label: "Inqubalab",
                value: "inqubalab",
              },
              {
                label: "Idea Feedback",
                value: "idea-feedback",
              },
              {
                label: "Aceleración",
                value: "aceleracion",
              },
            ]}
          />
        )}
        {table.getColumn("projectStatus") && (
          <DataTableFacetedFilter
            column={table.getColumn("projectStatus")}
            title="Estado"
            options={[
              {
                label: "Pendiente",
                value: "pending",
              },
              {
                label: "En Revisión",
                value: "reviewing",
              },
              {
                label: "Aprobado",
                value: "approved",
              },
              {
                label: "Rechazado",
                value: "rejected",
              },
              {
                label: "Completado",
                value: "completed",
              },
            ]}
          />
        )}
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
      <DataTableViewOptions table={table} />
    </div>
  )
} 