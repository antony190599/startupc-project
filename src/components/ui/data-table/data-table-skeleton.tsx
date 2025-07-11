import { Skeleton } from "@/components/ui/skeleton"

interface DataTableSkeletonProps {
  columnCount?: number
  rowCount?: number
}

export function DataTableSkeleton({ 
  columnCount = 5, 
  rowCount = 10 
}: DataTableSkeletonProps) {
  return (
    <div className="rounded-md border">
      {/* Table Header */}
      <div className="border-b">
        <div className="grid gap-4 py-3 px-4" style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}>
          {Array.from({ length: columnCount }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-24" />
          ))}
        </div>
      </div>

      {/* Table Rows */}
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <div key={rowIndex} className="border-b last:border-b-0">
          <div className="grid gap-4 py-4 px-4" style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}>
            {Array.from({ length: columnCount }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-4 w-32" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
} 