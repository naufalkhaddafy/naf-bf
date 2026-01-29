
import { Suspense } from "react"
import { CollectionFilters } from "@/components/collection/CollectionFilters"
import { CollectionMobileHeader } from "@/components/collection/CollectionMobileHeader"
import { CollectionList } from "@/components/collection/CollectionList"
import { CollectionGridSkeleton } from "@/components/collection/CollectionGridSkeleton"

interface SearchParams {
    category?: string
    type?: string
    price?: string
    sort?: string
    q?: string
    page?: string
}

export default async function CollectionPage({ 
    searchParams 
}: { 
    searchParams: Promise<SearchParams> 
}) {
    const params = await searchParams

    return (
        <div className="bg-gray-50 min-h-screen pt-14 lg:pt-16">
            {/* Page Header */}
            <div className="bg-emerald-900 text-white py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-emerald-900/90"></div>
                <div className="container mx-auto px-6 relative z-10 text-center md:text-left">
                    <h1 className="text-3xl md:text-5xl font-serif font-bold mb-3 animate-fade-in-up">Koleksi <span className="text-yellow-400">Premium</span></h1>
                    <p className="text-emerald-100 text-lg max-w-xl animate-fade-in-up delay-100">Temukan Cucak Rowo Super dan burung berkelas dengan jaminan genetik terbaik.</p>
                </div>
            </div>

            {/* Mobile Filter Header - Visible only on mobile/tablet */}
            <Suspense fallback={<div className="h-20 bg-white animate-pulse"></div>}>
                <CollectionMobileHeader />
            </Suspense>

            <section className="container mx-auto px-4 md:px-6 py-8 md:py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Sidebar Filter - Visible only on desktop */}
                    <aside className="hidden lg:block w-1/4 animate-fade-in-up delay-200">
                        <div className="sticky top-28">
                            <Suspense fallback={<div className="bg-white p-6 rounded-2xl shadow-lg border animate-pulse h-96"></div>}>
                                <CollectionFilters />
                            </Suspense>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <main className="w-full lg:w-3/4">
                        <Suspense 
                            fallback={<CollectionGridSkeleton />} 
                            key={JSON.stringify(params)}
                        >
                            <CollectionList searchParams={params} />
                        </Suspense>
                    </main>
                </div>
            </section>
        </div>
    )
}
