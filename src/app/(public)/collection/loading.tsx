import { Skeleton } from "@/components/ui/skeleton"

export default function CollectionLoading() {
    return (
        <div className="bg-gray-50 min-h-screen pt-16 lg:pt-20">
            {/* Page Header Skeleton */}
            <div className="bg-emerald-900/80 text-white py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-emerald-900/80"></div>
                <div className="container mx-auto px-6 relative z-10 text-center md:text-left">
                    <Skeleton className="h-12 w-64 md:w-80 bg-emerald-700/40 mb-3 mx-auto md:mx-0" />
                    <Skeleton className="h-6 w-80 md:w-[500px] bg-emerald-700/30 mx-auto md:mx-0" />
                </div>
            </div>

            {/* Mobile Filter Header Skeleton */}
            <div className="lg:hidden sticky top-16 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-10 w-32 rounded-xl" />
                <Skeleton className="h-10 w-10 rounded-xl" />
            </div>

            <section className="container mx-auto px-4 md:px-6 py-8 md:py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Sidebar Filter Skeleton - Desktop */}
                    <aside className="hidden lg:block w-1/4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                            <Skeleton className="h-6 w-32" />
                            <div className="space-y-3">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Skeleton className="h-5 w-5 rounded" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                ))}
                            </div>
                            <div className="border-t pt-6 space-y-3">
                                <Skeleton className="h-6 w-20" />
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Skeleton className="h-5 w-5 rounded" />
                                        <Skeleton className="h-4 w-28" />
                                    </div>
                                ))}
                            </div>
                            <div className="border-t pt-6 space-y-3">
                                <Skeleton className="h-6 w-24" />
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Skeleton className="h-5 w-5 rounded" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid Skeleton */}
                    <main className="w-full lg:w-3/4">
                        {/* Sorting & Result Count Skeleton */}
                        <div className="flex justify-between items-center mb-6 md:mb-8 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="h-10 w-32 rounded-lg hidden md:block" />
                        </div>

                        {/* Cards Grid Skeleton */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div 
                                    key={i} 
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                                    style={{ animationDelay: `${i * 80}ms` }}
                                >
                                    {/* Image Skeleton */}
                                    <div className="relative h-56 overflow-hidden">
                                        <Skeleton className="absolute inset-0 rounded-none" />
                                        {/* Badge Skeleton */}
                                        <Skeleton className="absolute top-3 left-3 h-6 w-16 rounded-full" />
                                        {/* Wishlist Button Skeleton */}
                                        <Skeleton className="absolute top-3 right-3 h-9 w-9 rounded-full" />
                                        {/* Status Badge Skeleton */}
                                        <Skeleton className="absolute bottom-3 left-3 h-5 w-20 rounded-full" />
                                    </div>

                                    {/* Content Skeleton */}
                                    <div className="p-5 space-y-3">
                                        {/* Tags Row */}
                                        <div className="flex gap-1.5">
                                            <Skeleton className="h-5 w-16 rounded" />
                                            <Skeleton className="h-5 w-14 rounded" />
                                        </div>
                                        
                                        {/* Title */}
                                        <Skeleton className="h-6 w-full" />
                                        <Skeleton className="h-6 w-3/4" />
                                        
                                        {/* Description */}
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-2/3" />
                                        
                                        {/* Price & Action */}
                                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                            <div className="space-y-1">
                                                <Skeleton className="h-3 w-10" />
                                                <Skeleton className="h-6 w-28" />
                                            </div>
                                            <Skeleton className="h-10 w-20 rounded-lg" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Skeleton */}
                        <div className="flex justify-center gap-2 mt-10">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <Skeleton className="h-10 w-10 rounded-lg" />
                        </div>
                    </main>
                </div>
            </section>
        </div>
    )
}
