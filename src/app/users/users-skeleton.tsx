import { DataTableSkeleton } from "@/components/ui/data-table"

export function UsersSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          <div className="h-4 w-80 bg-muted animate-pulse rounded" />
        </div>
      </div>

      {/* Table Skeleton */}
      <DataTableSkeleton columnCount={6} rowCount={5} />
    </div>
  )
}

export function UsersTableSkeleton() {
  return <DataTableSkeleton columnCount={6} rowCount={10} />
}
