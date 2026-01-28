import { Skeleton } from "@/components/ui/skeleton"

export default function LeadsLoading() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      {/* Stats Summary Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-7 w-12" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-10 w-72 rounded-xl" />
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      {/* Leads List Skeleton */}
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-4"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {/* Avatar */}
            <Skeleton className="w-12 h-12 rounded-full" />
            
            {/* Info */}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>
            
            {/* Message Preview */}
            <div className="hidden md:block flex-1">
              <Skeleton className="h-4 w-full max-w-xs" />
            </div>
            
            {/* Status & Time */}
            <div className="text-right space-y-2">
              <Skeleton className="h-6 w-16 rounded-full ml-auto" />
              <Skeleton className="h-3 w-24 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
