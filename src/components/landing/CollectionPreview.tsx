"use client"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, MessageCircle } from "lucide-react"

// Types
type Bird = {
  id: string
  title: string
  price: string
  tags: string[]
  image_url: string
  badge?: {
      text: string
      color: string
  }
}

// Placeholder Data for Development/Fallback
const PLACEHOLDER_BIRDS: Bird[] = [
    {
        id: "1",
        title: "Anakan (Trotolan)",
        price: "6.5jt",
        tags: ["3-4 Bln", "Makan Voer", "DNA"],
        image_url: "https://images.unsplash.com/photo-1596727147705-54a7128052a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        badge: { text: "Best Seller", color: "from-gold-500 to-gold-600" }
    },
    {
        id: "2",
        title: "Dewasa (Ropel)",
        price: "12.5jt",
        tags: ["1 Th+", "Ropel", "Jinak"],
        image_url: "https://images.unsplash.com/photo-1555169062-013468b47731?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        badge: { text: "Siap Kontes", color: "bg-emerald-600" }
    },
    {
        id: "3",
        title: "Pasangan Produksi",
        price: "25.0jt",
        tags: ["Koloni", "Garansi Jodoh", "Produk"],
        image_url: "https://images.unsplash.com/photo-1444464666117-26f60e11fc56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        badge: { text: "Indukan", color: "bg-blue-600" }
    }
]

export function CollectionPreview() {
  // In a real implementation, you would fetch from Supabase here
  // const supabase = await createClient()
  // const { data } = await supabase.from('posts').select('*')...
  
  const birds = PLACEHOLDER_BIRDS

  return (
    <section id="collection" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16 gap-4">
          <div className="text-center md:text-left w-full md:w-auto">
            <span className="text-emerald-600 font-bold tracking-widest text-xs md:text-sm uppercase mb-2 block">Katalog Premium</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-emerald-900">Stok Cucak Rowo</h2>
            <p className="text-gray-600 mt-2 md:mt-4 text-base md:text-lg">Tersedia anakan (trotol) hingga indukan produktif.</p>
          </div>
          <Link href="/collection" className="hidden md:inline-flex items-center gap-2 text-emerald-800 font-bold hover:text-gold-600 transition group">
            Lihat Semua Video <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {birds.map((bird) => (
            <div key={bird.id} className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2">
              <div className="relative h-64 md:h-72 overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition z-10"></div>
                <Image 
                    src={bird.image_url} 
                    alt={bird.title} 
                    fill 
                    className="object-cover transform group-hover:scale-110 transition duration-700" 
                />
                {bird.badge && (
                  <div className={`absolute top-4 right-4 z-20 text-white text-[10px] md:text-xs font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full uppercase tracking-wider shadow-lg ${bird.badge.color.startsWith('from') ? `bg-gradient-to-r ${bird.badge.color}` : bird.badge.color}`}>
                    {bird.badge.text}
                  </div>
                )}
              </div>
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 font-serif">{bird.title}</h3>
                  <span className="text-emerald-700 font-bold text-base md:text-lg">Rp {bird.price}</span>
                </div>
                <p className="text-gray-500 text-xs md:text-sm mb-6 flex flex-wrap gap-2">
                  {bird.tags.map((tag, i) => (
                    <span key={i} className="bg-gray-100 px-2 py-1 rounded">{tag}</span>
                  ))}
                </p>
                <hr className="border-gray-100 mb-6" />
                <Button 
                    variant="default"
                    className="w-full bg-emerald-900 hover:bg-emerald-800 text-white font-bold py-6 rounded-xl transition flex items-center justify-center gap-2 group-hover:bg-gold-500 text-sm md:text-base"
                    onClick={() => window.open(`https://wa.me/6281234567890?text=Halo%20Naf%20Bird%20Farm,%20saya%20tertarik%20dengan%20${bird.title}`, '_blank')}
                >
                  <MessageCircle className="w-4 h-4 md:w-5 md:h-5" /> Pesan via WhatsApp
                </Button>
              </div>
            </div>
          ))}
        </div>
        
         {/* Mobile Only Button */}
         <div className="mt-8 text-center md:hidden">
            <Link href="/collection" className="inline-flex items-center gap-2 text-emerald-800 font-bold hover:text-gold-600 transition group">
                Lihat Semua Video <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
      </div>
    </section>
  )
}

// Helper Button (Re-using shadcn component wrapper)
import { Button } from "@/components/ui/button"
