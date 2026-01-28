import { Skeleton } from "@/components/ui/skeleton"

export default function BirdsLoading() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-72" />
        </div>
        <Skeleton className="h-11 w-40 rounded-full" />
      </div>

      {/* Filters Skeleton */}
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      {/* Grid Skeleton - Bird Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {/* Image Skeleton */}
            <Skeleton className="h-48 w-full rounded-none" />
            
            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
