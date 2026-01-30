
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { CollectionSort } from "@/components/collection/CollectionSort"
import { CollectionPagination } from "@/components/collection/CollectionPagination"
import { BirdCard } from "@/components/collection/BirdCard"
import { Bird } from "lucide-react"

interface SearchParams {
    category?: string
    type?: string
    price?: string
    sort?: string
    q?: string
    page?: string
}

export async function CollectionList({ 
    searchParams 
}: { 
    searchParams: SearchParams 
}) {
    const params = searchParams
    const supabase = await createClient()
    
    // Build query with filters
    let query = supabase
        .from('posts')
        .select('*, post_birds(bird_id, birds(*))')
        .neq('status', 'archived')
    
    // Apply sorting
    const sort = params.sort || 'newest'
    if (sort === 'oldest') {
        query = query.order('created_at', { ascending: true })
    } else if (sort === 'price_asc') {
        query = query.order('price', { ascending: true, nullsFirst: false })
    } else if (sort === 'price_desc') {
        query = query.order('price', { ascending: false, nullsFirst: false })
    } else {
        query = query.order('created_at', { ascending: false })
    }
    
    const { data: postsData } = await query

    // Parse filter values
    const categoryFilters = params.category?.split(',').filter(Boolean) || []
    const typeFilters = params.type?.split(',').filter(Boolean) || []
    const priceFilters = params.price?.split(',').filter(Boolean) || []
    const searchQuery = params.q?.toLowerCase() || ''
    const currentPage = parseInt(params.page || '1')
    const itemsPerPage = 20

    // Map and filter posts
    const allFilteredPosts = postsData?.map(post => {
        const linkedBirds = post.post_birds?.map((pb: any) => pb.birds).filter(Boolean) || []
        const birdImage = linkedBirds.find((b: any) => b?.images?.[0])?.images?.[0] || null
        const birdCodes = linkedBirds.map((b: any) => b?.code).filter(Boolean)
        
        // Get genders from linked birds
        const genders = linkedBirds.map((b: any) => b?.gender).filter(Boolean)
        const hasMale = genders.includes('male')
        const hasFemale = genders.includes('female')
        
        let badge = { text: 'Tersedia', color: 'bg-emerald-600' }
        if (post.status === 'sold') badge = { text: 'Terjual', color: 'bg-red-600' }
        else if (post.status === 'booked') badge = { text: 'Dipesan', color: 'bg-amber-500' }
        
        // Calculate original price from linked birds
        const postPrice = post.price || 0
        const totalBirdPrice = linkedBirds.reduce((sum: number, b: any) => sum + (b?.price || 0), 0)
        const hasDiscount = totalBirdPrice > postPrice && postPrice > 0
        
        return {
            id: post.id,
            slug: post.slug,
            title: post.title,
            rawPrice: post.price || 0,
            price: post.price ? new Intl.NumberFormat('id-ID').format(post.price) : "Hubungi Kami",
            originalPrice: hasDiscount ? new Intl.NumberFormat('id-ID').format(totalBirdPrice) : null,
            birdCodes,
            birds: linkedBirds,
            tags: post.tags || [],
            type: post.type,
            hasMale,
            hasFemale,
            image_url: birdImage,
            description: post.content || "Belum ada deskripsi.",
            badge,
            sold: post.status === 'sold',
            booked: post.status === 'booked'
        }
    }).filter(post => {
        // Apply client-side filters
        
        // Search filter
        if (searchQuery) {
            const matchesSearch = 
                post.title.toLowerCase().includes(searchQuery) ||
                post.birdCodes.some((code: string) => code.toLowerCase().includes(searchQuery)) ||
                post.description.toLowerCase().includes(searchQuery)
            if (!matchesSearch) return false
        }
        
        // Category filter (tags)
        if (categoryFilters.length > 0) {
            const matchesCategory = categoryFilters.some(cat => post.tags.includes(cat))
            if (!matchesCategory) return false
        }
        
        // Type filter (male, female, pair)
        if (typeFilters.length > 0) {
            const matchesType = (() => {
                if (typeFilters.includes('pair') && post.type === 'pair') return true
                if (typeFilters.includes('male') && post.hasMale && post.type === 'single') return true
                if (typeFilters.includes('female') && post.hasFemale && post.type === 'single') return true
                return false
            })()
            if (!matchesType) return false
        }
        
        // Price filter
        if (priceFilters.length > 0) {
            const matchesPrice = (() => {
                if (post.rawPrice === 0) return true // "Hubungi Kami" always shows
                if (priceFilters.includes('under5') && post.rawPrice < 5000000) return true
                if (priceFilters.includes('5to10') && post.rawPrice >= 5000000 && post.rawPrice <= 10000000) return true
                if (priceFilters.includes('over10') && post.rawPrice > 10000000) return true
                return false
            })()
            if (!matchesPrice) return false
        }
        
        return true
    }) || []

    // Pagination calculations
    const totalItems = allFilteredPosts.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const paginatedPosts = allFilteredPosts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    return (
        <div className="w-full">
            {/* Sorting & Result Count */}
            <div className="flex justify-between items-center mb-6 md:mb-8 bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-fade-in-up delay-200">
                <p className="text-sm text-gray-500">
                    Menampilkan <span className="font-bold text-emerald-800">{paginatedPosts.length}</span> dari <span className="font-bold text-emerald-800">{totalItems}</span> koleksi
                </p>
                <div className="hidden md:block">
                    <CollectionSort />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up delay-300">
                {paginatedPosts.map((post) => (
                    <BirdCard key={post.id} post={post} />
                ))}
            </div>

            {/* Empty State */}
            {paginatedPosts.length === 0 && (
                <div className="text-center py-20">
                    <Bird className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Tidak ada hasil</h3>
                    <p className="text-gray-500 mb-6">Coba ubah filter atau kata kunci pencarian.</p>
                    <Button asChild variant="outline" className="rounded-full border-emerald-200 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50">
                        <Link href="/collection">
                            Reset Filter
                        </Link>
                    </Button>
                </div>
            )}

            <CollectionPagination 
                currentPage={currentPage}
                totalPages={totalPages}
            />
        </div>
    )
}
