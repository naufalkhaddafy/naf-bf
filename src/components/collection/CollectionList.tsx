
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Heart, Bird } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { CollectionSort } from "@/components/collection/CollectionSort"
import { CollectionPagination } from "@/components/collection/CollectionPagination"

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
                    <Link href={`/collection/${post.slug}`} key={post.id} className="block group">
                        <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1 ${post.sold ? 'opacity-80' : ''}`}>
                            {/* Image Area */}
                            <div className="relative h-56 overflow-hidden bg-gray-100">
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition z-10"></div>
                                {post.image_url ? (
                                    <Image 
                                        src={post.image_url} 
                                        alt={post.title} 
                                        fill 
                                        className={`object-cover transition duration-700 ${post.sold ? 'filter grayscale' : 'group-hover:scale-110'}`} 
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center">
                                        <Bird className="w-12 h-12 text-gray-300 mb-2" />
                                        <span className="text-xs text-gray-400">Belum ada foto</span>
                                    </div>
                                )}
                                
                                {/* Wishlist Button */}
                                <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white text-gray-400 hover:text-red-500 transition shadow-sm z-20">
                                    <Heart className="w-4 h-4" />
                                </button>
                                
                                {/* Type/Gender Badge */}
                                {post.type === 'pair' ? (
                                    <span className="absolute top-3 left-3 bg-purple-600 text-white text-[10px] px-2.5 py-1 rounded-full font-bold shadow-md z-20">
                                        Sepasang
                                    </span>
                                ) : post.hasMale ? (
                                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] px-2.5 py-1 rounded-full font-bold shadow-md z-20">
                                        Jantan ♂
                                    </span>
                                ) : post.hasFemale ? (
                                    <span className="absolute top-3 left-3 bg-pink-500 text-white text-[10px] px-2.5 py-1 rounded-full font-bold shadow-md z-20">
                                        Betina ♀
                                    </span>
                                ) : (
                                    <span className="absolute top-3 left-3 bg-gray-500 text-white text-[10px] px-2.5 py-1 rounded-full font-bold shadow-md z-20">
                                        Belum DNA
                                    </span>
                                )}
                                
                                {/* Status Overlay */}
                                {post.sold ? (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                                        <span className="bg-red-600 text-white font-bold px-4 py-2 rounded transform -rotate-12 border-2 border-white shadow-xl">TERJUAL</span>
                                    </div>
                                ) : post.booked ? (
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-20">
                                        <span className="bg-amber-500 text-white font-bold px-4 py-2 rounded transform -rotate-12 border-2 border-white shadow-xl">DIPESAN</span>
                                    </div>
                                ) : (
                                     <span className={`absolute bottom-3 left-3 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-md z-20 ${post.badge.color}`}>
                                        {post.badge.text}
                                    </span>
                                )}
                            </div>

                            {/* Content Area */}
                            <div className="p-5 flex-1 flex flex-col">
                                {/* Bird Codes + Tags Row */}
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                    {post.birdCodes.map((code: string, i: number) => (
                                        <span key={i} className="text-[10px] text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                            {code}
                                        </span>
                                    ))}
                                    {post.tags.map((tag: string, i: number) => (
                                        <span key={`tag-${i}`} className={`text-[10px] px-2 py-0.5 rounded font-medium capitalize ${
                                            tag === 'trotolan' ? 'bg-sky-50 text-sky-600' :
                                            tag === 'dewasa' ? 'bg-purple-50 text-purple-600' :
                                            tag === 'indukan_produk' ? 'bg-amber-50 text-amber-600' :
                                            'bg-gray-50 text-gray-500'
                                        }`}>
                                            {tag.replace('_', ' ')}
                                        </span>
                                    ))}
                                </div>
                                
                                {/* Title */}
                                <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-emerald-700 transition font-serif line-clamp-2">{post.title}</h3>
                                
                                {/* Description */}
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{post.description}</p>
                                
                                {/* Price & Action */}
                                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <div>
                                        <span className="text-xs text-gray-400">Harga</span>
                                        <div className="flex items-baseline gap-2">
                                            <p className={`font-bold text-lg ${post.sold ? 'text-gray-400 line-through' : 'text-emerald-800'}`}>
                                                {post.price === 'Hubungi Kami' ? post.price : `Rp ${post.price}`}
                                            </p>
                                            {post.originalPrice && !post.sold && (
                                                <span className="text-xs text-gray-400 line-through">
                                                    Rp {post.originalPrice}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {post.sold ? (
                                         <button disabled className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm font-bold cursor-not-allowed">Stok Habis</button>
                                    ) : (
                                        <span className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold hover:bg-emerald-100 transition flex items-center gap-1 group-hover:shadow-md">
                                            Detail <ArrowRight className="w-3 h-3" />
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
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
