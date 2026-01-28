import { Skeleton } from "@/components/ui/skeleton"

export default function CollectionDetailLoading() {
    return (
        <div className="bg-gray-50 min-h-screen pt-24">
            <div className="container mx-auto px-4 md:px-6 mb-4">
                {/* Breadcrumb Skeleton */}
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 w-fit shadow-sm">
                    <Skeleton className="h-4 w-14" />
                    <Skeleton className="h-4 w-3" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-3" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left: Image Gallery Skeleton */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <Skeleton className="aspect-square w-full rounded-2xl" />
                        
                        {/* Thumbnails */}
                        <div className="flex gap-2 overflow-hidden">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton 
                                    key={i} 
                                    className="w-20 h-20 rounded-xl flex-shrink-0" 
                                    style={{ animationDelay: `${i * 50}ms` }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Info Skeleton */}
                    <div className="space-y-6">
                        {/* Badges */}
                        <div className="flex gap-2">
                            <Skeleton className="h-7 w-20 rounded-full" />
                            <Skeleton className="h-7 w-16 rounded-full" />
                            <Skeleton className="h-7 w-24 rounded-full" />
                        </div>

                        {/* Title */}
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-3/4" />

                        {/* Ring Code */}
                        <Skeleton className="h-6 w-32" />

                        {/* Price */}
                        <div className="pt-4 border-t border-gray-100">
                            <Skeleton className="h-4 w-12 mb-2" />
                            <Skeleton className="h-10 w-48" />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Skeleton className="h-14 flex-1 rounded-xl" />
                            <Skeleton className="h-14 w-14 rounded-xl" />
                        </div>

                        {/* Specs Tabs */}
                        <div className="pt-6 space-y-4">
                            <div className="flex gap-2 border-b border-gray-100 pb-2">
                                <Skeleton className="h-10 w-24 rounded-lg" />
                                <Skeleton className="h-10 w-20 rounded-lg" />
                            </div>
                            
                            {/* Specs Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                {[...Array(6)].map((_, i) => (
                                    <div 
                                        key={i} 
                                        className="bg-white p-4 rounded-xl border border-gray-100 space-y-2"
                                        style={{ animationDelay: `${i * 60}ms` }}
                                    >
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-5 w-24" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description Section */}
                <div className="mt-12 bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
                    <Skeleton className="h-7 w-32 mb-6" />
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>

                {/* Videos Section */}
                <div className="mt-8 bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
                    <Skeleton className="h-7 w-36 mb-6" />
                    <Skeleton className="aspect-video w-full rounded-xl" />
                    <div className="flex gap-3 mt-4 overflow-hidden">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton 
                                key={i} 
                                className="w-32 h-20 rounded-lg flex-shrink-0" 
                                style={{ animationDelay: `${i * 50}ms` }}
                            />
                        ))}
                    </div>
                </div>

                {/* Pedigree Section */}
                <div className="mt-8 bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
                    <Skeleton className="h-7 w-28 mb-6" />
                    <div className="flex justify-center gap-8">
                        <div className="text-center space-y-2">
                            <Skeleton className="w-24 h-24 rounded-full mx-auto" />
                            <Skeleton className="h-4 w-16 mx-auto" />
                            <Skeleton className="h-5 w-24 mx-auto" />
                        </div>
                        <div className="text-center space-y-2">
                            <Skeleton className="w-24 h-24 rounded-full mx-auto" />
                            <Skeleton className="h-4 w-16 mx-auto" />
                            <Skeleton className="h-5 w-24 mx-auto" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
