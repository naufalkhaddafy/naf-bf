"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Heart, Bird } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button" // Ensure this is needed or remove if not used directly

interface BirdCardProps {
  post: {
    id: string
    slug: string
    title: string
    price: string | number
    originalPrice: string | null
    birdCodes: string[]
    tags: string[]
    type: string
    hasMale: boolean
    hasFemale: boolean
    image_url: string | null
    description: string
    badge: { text: string; color: string }
    sold: boolean
    booked: boolean
  }
}

export function BirdCard({ post }: BirdCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    // Check local storage on mount
    const saved = localStorage.getItem("naf_favorites")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.includes(post.id)) {
          setIsFavorite(true)
        }
      } catch (e) {
        console.error("Failed to parse favorites", e)
      }
    }
  }, [post.id])

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation to detail page
    e.stopPropagation() 

    const saved = localStorage.getItem("naf_favorites")
    let favorites: string[] = []
    
    if (saved) {
        try {
            favorites = JSON.parse(saved)
            if (!Array.isArray(favorites)) favorites = []
        } catch (e) {
            favorites = []
        }
    }

    if (isFavorite) {
      favorites = favorites.filter(id => id !== post.id)
      setIsFavorite(false)
      toast.info("Dihapus dari favorit.")
    } else {
      if (!favorites.includes(post.id)) {
        favorites.push(post.id)
      }
      setIsFavorite(true)
      toast.success("Disimpan ke favorit! ❤️")
    }

    localStorage.setItem("naf_favorites", JSON.stringify(favorites))
    window.dispatchEvent(new Event("favorites-updated"))
  }

  return (
    <Link href={`/collection/${post.slug}`} className="block group">
        <div className={cn(
            "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1",
            post.sold ? 'opacity-80' : ''
        )}>
            {/* Image Area */}
            <div className="relative h-56 overflow-hidden bg-gray-100">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition z-10"></div>
                {post.image_url ? (
                    <Image 
                        src={post.image_url} 
                        alt={post.title} 
                        fill 
                        className={cn(
                            "object-cover transition duration-700",
                            post.sold ? 'filter grayscale' : 'group-hover:scale-110'
                        )} 
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <Bird className="w-12 h-12 text-gray-300 mb-2" />
                        <span className="text-xs text-gray-400">Belum ada foto</span>
                    </div>
                )}
                
                {/* Wishlist Button */}
                <button 
                    onClick={toggleFavorite}
                    className={cn(
                        "absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition shadow-sm z-20",
                        isFavorite ? "text-red-500 bg-white" : "text-gray-400 hover:text-red-500"
                    )}
                >
                    <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
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
                        <span className={cn(
                            "absolute bottom-3 left-3 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-md z-20",
                            post.badge.color
                        )}>
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
                        <span key={`tag-${i}`} className={cn(
                            "text-[10px] px-2 py-0.5 rounded font-medium capitalize",
                            tag === 'trotolan' ? 'bg-sky-50 text-sky-600' :
                            tag === 'dewasa' ? 'bg-purple-50 text-purple-600' :
                            tag === 'indukan_produk' ? 'bg-amber-50 text-amber-600' :
                            'bg-gray-50 text-gray-500'
                        )}>
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
                            <p className={cn(
                                "font-bold text-lg",
                                post.sold ? 'text-gray-400 line-through' : 'text-emerald-800'
                            )}>
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
  )
}
