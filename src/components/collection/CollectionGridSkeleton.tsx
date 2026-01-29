
import { Skeleton } from "@/components/ui/skeleton"

export function CollectionGridSkeleton() {
  return (
    <div className="w-full">
      {/* Sorting & Count Skeleton */}
      <div className="flex justify-between items-center mb-6 md:mb-8 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="hidden md:block h-10 w-40 rounded-lg" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[450px]">
            {/* Image Skeleton */}
            <Skeleton className="h-56 w-full" />
            
            {/* Content Skeleton */}
            <div className="p-5 flex-1 flex flex-col space-y-4">
              {/* Chips */}
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded" />
                <Skeleton className="h-5 w-20 rounded" />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-2/3" />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>

              {/* Footer */}
              <div className="pt-4 mt-auto border-t border-gray-50 flex justify-between items-center">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-10" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-9 w-24 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination Skeleton */}
      <div className="mt-12 flex justify-center">
        <Skeleton className="h-10 w-64 rounded-full" />
      </div>
    </div>
  )
}
