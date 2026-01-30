"use client"

import { useState, useEffect } from "react"
import { getFavoritePosts } from "@/actions/posts" 
import { BirdCard } from "@/components/collection/BirdCard"
import { Bird, Heart, Loader2, ArrowLeft, ShoppingCart, MessageCircle, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ContactButton } from "@/components/ui/ContactButton"

export default function FavoritesPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFavorites = async () => {
    setLoading(true)
    const saved = localStorage.getItem("naf_favorites")
    if (saved) {
      try {
        const ids = JSON.parse(saved)
        if (Array.isArray(ids) && ids.length > 0) {
          const data = await getFavoritePosts(ids)
          setPosts(data)
        } else {
          setPosts([])
        }
      } catch (e) {
          setPosts([])
      }
    } else {
      setPosts([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchFavorites()

    // Listen for storage changes in other tabs or components
    const handleStorageChange = () => fetchFavorites()
    window.addEventListener('storage', handleStorageChange) 
    
    // Custom event for internal updates (if needed, though React state usually handles this)
    window.addEventListener('favorites-updated', handleStorageChange)

    return () => {
        window.removeEventListener('storage', handleStorageChange)
        window.removeEventListener('favorites-updated', handleStorageChange)
    }
  }, [])

  // Calculate Totals
  const totalItems = posts.length
  const totalPrice = posts.reduce((sum, post) => sum + (post.rawPrice || 0), 0)
  const formattedTotal = new Intl.NumberFormat('id-ID').format(totalPrice)

  const handleClearAll = () => {
      if (confirm("Apakah Anda yakin ingin menghapus semua favorit?")) {
          localStorage.removeItem("naf_favorites")
          setPosts([])
          toast.success("Favorit berhasil dikosongkan.")
          window.dispatchEvent(new Event("favorites-updated"))
      }
  }

  // Generate WhatsApp Message
  const waMessage = `Halo NAF Aviary, saya berminat dengan burung-burung berikut:%0A%0A${posts.map((p, i) => `${i+1}. *${p.title}* (Ring: ${p.birdCodes.join(', ')}) - Rp ${p.price}`).join('%0A')}%0A%0A*Total Estimasi: Rp ${formattedTotal}*%0A%0AMohon info ketersediaannya. Terima kasih.`

  return (
    <div className="container mx-auto px-4 md:px-6 py-24 md:py-28 min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 md:mb-10">
          <div className="flex items-center gap-3">
            <Link href="/collection" className="p-2.5 bg-white hover:bg-gray-100 rounded-full transition shadow-sm border border-gray-100">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 flex items-center gap-2">
                    <ShoppingCart className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" /> Keranjang Favorit
                </h1>
                <p className="text-gray-500 text-sm">Kelola daftar burung incaran Anda di sini.</p>
            </div>
          </div>

          {posts.length > 0 && (
              <Button 
                variant="outline" 
                onClick={handleClearAll}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100"
              >
                  <Trash2 className="w-4 h-4 mr-2" /> Hapus Semua
              </Button>
          )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl h-[400px] animate-pulse border border-gray-100 shadow-sm" />
            ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Left Column: Items List */}
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                {posts.map((post) => (
                    <BirdCard key={post.id} post={post} />
                ))}
            </div>

            {/* Right Column: Order Summary (Sticky) */}
            <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-24 animate-fade-in-up delay-100">
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-emerald-900/5">
                        <h3 className="font-bold text-lg text-emerald-900 flex items-center gap-2">
                            <Bird className="w-5 h-5" /> Ringkasan
                        </h3>
                    </div>
                    
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center text-gray-600">
                            <span>Total Item</span>
                            <span className="font-bold text-gray-900">{totalItems} Item</span>
                        </div>
                        
                        <div className="space-y-2">
                             {posts.map(post => (
                                 <div key={post.id} className="flex justify-between text-sm">
                                     <span className="text-gray-500 truncate max-w-[180px]">{post.title}</span>
                                     <span className="font-medium">{post.price === 'Hubungi Kami' ? '-' : `Rp ${post.price}`}</span>
                                 </div>
                             ))}
                        </div>

                        <div className="h-px bg-gray-100 my-4" />

                        <div className="flex justify-between items-end">
                            <span className="text-gray-600 font-medium">Total Estimasi</span>
                            <span className="text-2xl font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                                Rp {formattedTotal}
                            </span>
                        </div>

                        <p className="text-xs text-gray-400 mt-2 bg-gray-50 p-2 rounded border border-gray-100">
                            *Harga belum termasuk ongkos kirim. Ketersediaan stok dapat berubah sewaktu-waktu.
                        </p>

                        <ContactButton 
                            asChild 
                            message={`Halo NAF Aviary, saya berminat dengan burung-burung berikut:\n\n${posts.map((p, i) => `${i+1}. ${p.title} (Ring: ${p.birdCodes.join(', ')}) - Rp ${p.price}`).join('\n')}\n\nTotal Estimasi: Rp ${formattedTotal}\n\nMohon info ketersediaannya. Terima kasih.`}
                        >
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 transition-all mt-6 text-lg group">
                                <MessageCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition" />
                                Pesan Sekarang
                            </Button>
                        </ContactButton>

                        <div className="text-center">
                            <Link href="/collection" className="text-sm text-gray-500 hover:text-emerald-600 hover:underline">
                                Tambah burung lain
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm mx-auto max-w-2xl animate-fade-in-up">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                <ShoppingCart className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 font-serif">Keranjang Favorit Kosong</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                Anda belum menyimpan burung apapun. Telusuri koleksi kami dan temukan burung impian Anda.
            </p>
            <Button asChild size="lg" className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-12 text-base shadow-lg shadow-emerald-600/20">
                <Link href="/collection">
                    Mulai Belanja
                </Link>
            </Button>
        </div>
      )}
    </div>
  )
}
