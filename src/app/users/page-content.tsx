"use client"

import { useState, useEffect } from "react"
import { DataTable, DataTableToolbar, DataTableFacetedFilter, DataTableViewOptions } from "@/components/ui/data-table"
import { columns } from "./columns"
import { TransformedUser } from "@/lib/api/users/transformer-users"
import { UsersTableSkeleton } from "./users-skeleton"

interface UsersResponse {
  rows: TransformedUser[]
  summary: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export function UsersPageContent() {
  const [data, setData] = useState<TransformedUser[]>([])
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

  const fetchUsers = async (
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

      const response = await fetch(`/api/users?${params}`)
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const result: UsersResponse = await response.json()
      setData(result.rows)
      setPagination(result.summary)
    } catch (error) {
      console.error("Error fetching users:", error)
      // You might want to show a toast notification here
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(pagination.page, pagination.pageSize, searchValue, sortBy, sortOrder)
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

  // Custom toolbar component for users
  const UsersToolbar = ({ table, onSearch, searchValue }: any) => {
    const roles = [
      { value: "entrepreneur", label: "Emprendedor" },
      { value: "admin", label: "Administrador" },
    ]

    return (
      <DataTableToolbar
        table={table}
        onSearch={onSearch}
        searchValue={searchValue}
        searchPlaceholder="Buscar usuarios..."
        filters={
          <DataTableFacetedFilter
            column={table.getColumn("role")}
            title="Rol"
            options={roles}
          />
        }
        viewOptions={
          <DataTableViewOptions
            table={table}
            columnLabels={{
              firstname: "Usuario",
              role: "Rol",
              teamMember: "Información Académica",
              contactEmail: "Email de Contacto",
              status: "Estado",
              createdAt: "Fecha de Registro",
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
          <h1 className="text-3xl font-bold">Usuarios</h1>
          <p className="text-muted-foreground">
            Gestiona todos los usuarios del sistema
          </p>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data}
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSearch={handleSearch}
        searchValue={searchValue}
        loading={loading}
        emptyMessage="No se encontraron usuarios."
        toolbar={UsersToolbar}
        skeleton={UsersTableSkeleton}
      />
    </div>
  )
}
