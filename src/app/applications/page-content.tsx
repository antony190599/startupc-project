"use client"

import { useState, useEffect } from "react"
import { TransformedApplication } from "@/lib/api/applications/transformer-applications"
import { DataTable, DataTableToolbar, DataTableFacetedFilter, DataTableViewOptions } from "@/components/ui/data-table"
import { columns } from "./columns"
import { ApplicationsTableSkeleton } from "./applications-skeleton"
import { ProjectStatus } from "@/lib/enum"

interface ApplicationsResponse {
  rows: TransformedApplication[]
  summary: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export function ApplicationsPageContent() {
  const [data, setData] = useState<TransformedApplication[]>([])
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

  const fetchApplications = async (
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

      const response = await fetch(`/api/applications?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch applications')
      }

      const result: { success: boolean; data: ApplicationsResponse } = await response.json()
      
      if (result.success) {
        setData(result.data.rows)
        setPagination(result.data.summary)
      } else {
        console.error('API returned error:', result)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications(pagination.page, pagination.pageSize, searchValue, sortBy, sortOrder)
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

  // Custom toolbar component for applications
  const ApplicationsToolbar = ({ table, onSearch, searchValue }: any) => {
    return (
      <DataTableToolbar
        table={table}
        onSearch={onSearch}
        searchValue={searchValue}
        searchPlaceholder="Buscar aplicaciones..."
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
            {table.getColumn("projectStatus") && (
              <DataTableFacetedFilter
                column={table.getColumn("projectStatus")}
                title="Estado"
                options={[
                  {
                    label: "Creado",
                    value: ProjectStatus.CREATED,
                  },
                  {
                    label: "Pendiente de Revisión",
                    value: ProjectStatus.PENDING_INTAKE,
                  },
                  {
                    label: "Aprobado",
                    value: ProjectStatus.APPROVED,
                  },
                  {
                    label: "Rechazado",
                    value: ProjectStatus.REJECTED,
                  },
                  {
                    label: "Revisión Técnica",
                    value: ProjectStatus.TECHNICAL_REVIEW,
                  },
                  {
                    label: "Aceptado",
                    value: ProjectStatus.ACCEPTED,
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
              projectName: "Nombre del Proyecto",
              programType: "Tipo de Programa",
              primaryUser: "Usuario Principal",
              projectStatus: "Estado",
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
          <h1 className="text-3xl font-bold">Mis Aplicaciones</h1>
          <p className="text-muted-foreground">
            Aquí podrás ver todas tus aplicaciones y su estado actual.
          </p>
        </div>
      </div>

      {data.length === 0 && !loading ? (
        <div className="mt-8 p-8 text-center border rounded-lg border-dashed">
          <h2 className="text-xl font-semibold mb-2">No hay aplicaciones activas</h2>
          <p className="text-muted-foreground">
            Cuando envíes una aplicación, aparecerá aquí para que puedas hacer seguimiento.
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
          emptyMessage="No se encontraron aplicaciones."
          toolbar={ApplicationsToolbar}
          skeleton={ApplicationsTableSkeleton}
        />
      )}
    </div>
  )
}
