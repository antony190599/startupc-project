import { DataTableSkeleton } from "@/components/ui/data-table"

export function ApplicationsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted animate-pulse rounded" />
          <div className="h-4 w-96 bg-muted animate-pulse rounded" />
        </div>
      </div>

      {/* Table Skeleton */}
      <DataTableSkeleton columnCount={5} rowCount={5} />
    </div>
  )
}

export function ApplicationsTableSkeleton() {
  return <DataTableSkeleton columnCount={5} rowCount={10} />
} 