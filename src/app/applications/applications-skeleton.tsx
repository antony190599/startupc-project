import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function ApplicationsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>

      {/* Table Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Table Header */}
          <div className="border-b">
            <div className="grid grid-cols-5 gap-4 py-3 px-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          {/* Table Rows */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="border-b last:border-b-0">
              <div className="grid grid-cols-5 gap-4 py-4 px-4">
                {/* Project Name */}
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                </div>
                
                {/* Program Type */}
                <div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                
                {/* Primary User */}
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
                
                {/* Status */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>
                
                {/* Actions */}
                <div className="flex justify-end">
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            </div>
          ))}

          {/* Pagination Skeleton */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function ApplicationsTableSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        {/* Table Header */}
        <div className="border-b">
          <div className="grid grid-cols-5 gap-4 py-3 px-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        {/* Table Rows */}
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="border-b last:border-b-0">
            <div className="grid grid-cols-5 gap-4 py-4 px-4">
              {/* Project Name */}
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
              </div>
              
              {/* Program Type */}
              <div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              
              {/* Primary User */}
              <div className="space-y-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
              
              {/* Status */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
              
              {/* Actions */}
              <div className="flex justify-end">
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
} 