"use client"

import { useState, useEffect } from "react"
import { TransformedApplication } from "@/lib/api/applications/transformer-applications"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { ApplicationsSkeleton } from "./applications-skeleton"

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

      {loading ? (
        <ApplicationsSkeleton />
      ) : data.length === 0 ? (
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
        />
      )}
    </div>
  )
}
