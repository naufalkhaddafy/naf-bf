import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Welcome Header Skeleton */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-900/50 via-emerald-800/50 to-emerald-900/50 p-8 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-3">
            <Skeleton className="h-4 w-28 bg-emerald-700/30" />
            <Skeleton className="h-10 w-64 bg-emerald-700/30" />
            <Skeleton className="h-4 w-48 bg-emerald-700/30" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32 rounded-xl bg-emerald-700/30" />
            <Skeleton className="h-10 w-32 rounded-xl bg-emerald-700/30" />
          </div>
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          'bg-emerald-400/20',
          'bg-blue-400/20',
          'bg-amber-400/20',
          'bg-purple-400/20'
        ].map((bg, i) => (
          <div 
            key={i} 
            className={`rounded-2xl p-6 ${bg}`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="w-12 h-12 rounded-xl bg-white/20" />
              <Skeleton className="h-6 w-14 rounded-full bg-white/20" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-white/20" />
              <Skeleton className="h-8 w-20 bg-white/20" />
              <Skeleton className="h-3 w-28 bg-white/20" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Skeleton */}
        <div className="lg:col-span-1 bg-white/70 rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Leads Skeleton */}
        <div className="lg:col-span-2 bg-white/70 rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="h-5 w-28" />
            </div>
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50/50">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="text-right space-y-2">
                  <Skeleton className="h-5 w-12 rounded-full ml-auto" />
                  <Skeleton className="h-3 w-20 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white/70 rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex items-center gap-4">
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
