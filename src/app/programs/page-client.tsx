"use client"

import { useState, useEffect } from "react"
import { TransformedProgram } from "@/lib/api/programs/transformer-programs"
import { DataTable, DataTableToolbar, DataTableFacetedFilter, DataTableViewOptions } from "@/components/ui/data-table"
import { columns } from "./columns"
import { ProgramsTableSkeleton } from "./programs-skeleton"
import { CreateProgramSheet } from "./create-program-sheet"

interface ProgramsResponse {
  rows: TransformedProgram[]
  summary: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export function ProgramsPageContent() {
  const [data, setData] = useState<TransformedProgram[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  })
  const [loading, setLoading] = useState(true)
  const [searchValue, setSearchValue] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const fetchPrograms = async (
    page: number = 1,
    pageSize: number = 10,
    search: string = "",
    sortBy: string = "createdAt",
    sortOrder: "asc" | "desc" = "desc"
  ) => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        sortBy,
        sortOrder,
        ...(search && { search }),
      })

      const response = await fetch(`/api/programs?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch programs')
      }

      const result: ProgramsResponse = await response.json()
      
      setData(result.rows)
      setPagination(result.summary)
    } catch (error) {
      console.error('Error fetching programs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrograms(pagination.page, pagination.pageSize, searchValue, sortBy, sortOrder)
  }, [pagination.page, pagination.pageSize, searchValue, sortBy, sortOrder])

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  const handlePageSizeChange = (pageSize: number) => {
    setPagination(prev => ({ ...prev, pageSize, page: 1 }))
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // Custom toolbar component for programs
  const ProgramsToolbar = ({ table, onSearch, searchValue }: any) => {
    return (
      <DataTableToolbar
        table={table}
        onSearch={onSearch}
        searchValue={searchValue}
        searchPlaceholder="Buscar programas..."
        filters={
          <>
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
            {table.getColumn("status") && (
              <DataTableFacetedFilter
                column={table.getColumn("status")}
                title="Estado"
                options={[
                  {
                    label: "Borrador",
                    value: "draft",
                  },
                  {
                    label: "Publicado",
                    value: "published",
                  },
                  {
                    label: "Inactivo",
                    value: "inactive",
                  },
                ]}
              />
            )}
          </>
        }
        viewOptions={
          <DataTableViewOptions
            table={table}
            columnLabels={{
              name: "Nombre",
              description: "Descripción",
              programType: "Tipo de Programa",
              startDate: "Fecha de Inicio",
              endDate: "Fecha de Fin",
              cohortCode: "Código de Cohorte",
              year: "Año",
              status: "Estado",
              actions: "Acciones",
            }}
          />
        }
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Programas</h1>
          <p className="text-muted-foreground">
            Gestiona todos los programas disponibles en la plataforma.
          </p>
        </div>
        <CreateProgramSheet onProgramCreated={() => {
          // Refresh the data when a new program is created
          fetchPrograms(pagination.page, pagination.pageSize, searchValue, sortBy, sortOrder)
        }} />
      </div>

      {data.length === 0 && !loading ? (
        <div className="mt-8 p-8 text-center border rounded-lg border-dashed">
          <h2 className="text-xl font-semibold mb-2">No hay programas disponibles</h2>
          <p className="text-muted-foreground">
            Cuando se creen programas, aparecerán aquí para que puedas gestionarlos.
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSearch={handleSearch}
          searchValue={searchValue}
          loading={loading}
          emptyMessage="No se encontraron programas."
          toolbar={ProgramsToolbar}
          skeleton={ProgramsTableSkeleton}
        />
      )}
    </div>
  )
}
