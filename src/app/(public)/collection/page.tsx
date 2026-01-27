import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Filter, SlidersHorizontal, Search, Heart, Star, ChevronLeft, ChevronRight, ChevronDown, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/server"

export default async function CollectionPage() {
    const supabase = await createClient()
    const { data: birdsData } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

    // Map DB data to UI format
    const birds = birdsData?.map(bird => ({
        id: bird.id,
        slug: bird.slug,
        title: bird.title,
        price: bird.price ? new Intl.NumberFormat('id-ID', { maximumSignificantDigits: 3 }).format(bird.price) : "Hub. Kami",
        code: bird.code || "NAF-XXX",
        tags: bird.tags || [],
        image_url: bird.image_url || "https://images.unsplash.com/photo-1555169062-013468b47731?auto=format&fit=crop&w=600",
        description: bird.description || bird.content || "Belum ada deskripsi.",
        badge: { 
            text: bird.status === 'sold' ? 'Terjual' : 'Tersedia', 
            color: bird.status === 'sold' ? 'bg-red-600' : 'bg-emerald-600' 
        },
        sold: bird.status === 'sold'
    })) || []

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Page Header */}
            <div className="bg-emerald-900 text-white py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-emerald-900/90"></div>
                <div className="container mx-auto px-6 relative z-10 text-center md:text-left">
                    <h1 className="text-3xl md:text-5xl font-serif font-bold mb-3 animate-fade-in-up">Koleksi <span className="text-gold-400">Premium</span></h1>
                    <p className="text-emerald-100 text-lg max-w-xl animate-fade-in-up delay-100">Temukan Cucak Rowo Ropel dan burung kicau berkelas dengan jaminan genetik terbaik.</p>
                </div>
            </div>

            <section className="container mx-auto px-4 md:px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Sidebar Filter */}
                    <aside className="w-full lg:w-1/4 animate-fade-in-up delay-200">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-emerald-600" /> Filter</h3>
                                <button className="text-xs text-red-500 hover:text-red-600 font-medium hover:underline transition">Reset</button>
                            </div>

                            <div className="md:hidden mb-6 relative">
                                <Input type="text" placeholder="Cari burung..." className="bg-gray-50 rounded-xl" />
                                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                            </div>

                            {/* Filter Groups (Static for Demo) */}
                            <div className="mb-6 border-b border-gray-100 pb-6">
                                <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Kategori Umur</h4>
                                <div className="space-y-3">
                                    {['Trotolan (Anakan)', 'Dewasa / Siapan', 'Indukan Produk'].map((label, i) => (
                                        <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300" />
                                            <span className="text-sm text-gray-600 group-hover:text-emerald-700 transition">{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                             <Button className="w-full bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold">Terapkan Filter</Button>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <main className="w-full lg:w-3/4">
                         {/* Sorting & Result Count */}
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-fade-in-up delay-200">
                            <p className="text-sm text-gray-500 mb-4 sm:mb-0">Menampilkan <span className="font-bold text-emerald-800">1-{birds.length}</span> dari <span className="font-bold text-emerald-800">{birds.length}</span> burung</p>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-500">Urutkan:</span>
                                <div className="relative">
                                    <select className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 pr-8">
                                        <option>Terbaru</option>
                                        <option>Harga Terendah</option>
                                        <option>Harga Tertinggi</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up delay-300">
                            {birds.map((bird) => (
                                <Link href={`/collection/${bird.slug}`} key={bird.id} className="block group">
                                    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1 ${bird.sold ? 'opacity-75' : ''}`}>
                                        <div className="relative h-56 overflow-hidden">
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition z-10"></div>
                                            {bird.image_url ? (
                                                <Image 
                                                    src={bird.image_url} 
                                                    alt={bird.title} 
                                                    fill 
                                                    className={`object-cover transition duration-700 ${bird.sold ? 'filter grayscale' : 'group-hover:scale-110'}`} 
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center p-4">
                                                    <Image 
                                                        src="/icon/icon.png" 
                                                        alt="No Image" 
                                                        width={48} 
                                                        height={48} 
                                                        className="w-12 h-12 opacity-50 mb-2" 
                                                    />
                                                    <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">No Image</span>
                                                </div>
                                            )}
                                            <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white text-gray-400 hover:text-red-500 transition shadow-sm z-20">
                                                <Heart className="w-4 h-4" />
                                            </button>
                                            
                                            {bird.sold ? (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                                                    <span className="bg-red-600 text-white font-bold px-4 py-2 rounded transform -rotate-12 border-2 border-white shadow-xl">TERJUAL</span>
                                                </div>
                                            ) : (
                                                 <span className={`absolute bottom-3 left-3 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-md z-20 ${bird.badge.color}`}>
                                                    {bird.badge.text}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="text-[10px] text-gray-400 font-mono bg-gray-100 px-2 py-0.5 rounded">{bird.code}</div>
                                                <div className="flex text-gold-400">
                                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-emerald-700 transition font-serif">{bird.title}</h3>
                                            <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{bird.description}</p>
                                            
                                            <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                                <span className={`font-bold text-lg ${bird.sold ? 'text-gray-400 decoration-red-500 line-through' : 'text-emerald-800'}`}>Rp {bird.price}</span>
                                                {bird.sold ? (
                                                     <button disabled className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm font-bold cursor-not-allowed">Stok Habis</button>
                                                ) : (
                                                    <span className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold hover:bg-gold-500 hover:text-white transition flex items-center gap-1 group-hover:shadow-md">
                                                        Detail <ArrowRight className="w-3 h-3" />
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                         {/* Pagination */}
                        <div className="mt-12 flex justify-center">
                            <nav className="flex items-center gap-2">
                                <Button variant="outline" size="icon" disabled><ChevronLeft className="w-4 h-4" /></Button>
                                <Button variant="default" className="bg-emerald-800">1</Button>
                                <Button variant="outline">2</Button>
                                <Button variant="outline">3</Button>
                                <span className="px-2 text-gray-400">...</span>
                                <Button variant="outline" size="icon"><ChevronRight className="w-4 h-4" /></Button>
                            </nav>
                        </div>
                    </main>
                </div>
            </section>
        </div>
    )
}
