import Link from "next/link"
import Image from "next/image"
import { ArrowRight, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"

export async function CollectionPreview() {
  const supabase = await createClient()
  
  // Fetch latest 3 available posts with bird data
  const { data: postsData } = await supabase
    .from('posts')
    .select(`
      id,
      slug,
      title,
      price,
      tags,
      type,
      status,
      post_birds (
        birds (
          id,
          code,
          images,
          gender
        )
      )
    `)
    .eq('status', 'available')
    .order('created_at', { ascending: false })
    .limit(3)

  // Map to display format
  const birds = (postsData || []).map(post => {
    const linkedBirds = post.post_birds?.map((pb: any) => pb.birds).filter(Boolean) || []
    const firstBirdImage = linkedBirds.find((b: any) => b?.images?.[0])?.images?.[0] || null
    
    // Determine badge based on tags
    const tags = Array.isArray(post.tags) ? post.tags : []
    let badge = { text: "Tersedia", color: "bg-emerald-600" }
    if (tags.includes('trotolan')) badge = { text: "Anakan", color: "bg-yellow-500" }
    else if (tags.includes('dewasa')) badge = { text: "Siapan", color: "bg-blue-600" }
    else if (tags.includes('indukan_produk')) badge = { text: "Indukan", color: "bg-purple-600" }
    if (post.type === 'pair') badge = { text: "Sepasang", color: "bg-pink-600" }
    
    // Format tags for display
    const displayTags = []
    if (linkedBirds.length > 0) {
      const genders = linkedBirds.map((b: any) => b.gender).filter(Boolean)
      if (genders.includes('male') && genders.includes('female')) displayTags.push('Sepasang')
      else if (genders.includes('male')) displayTags.push('Jantan')
      else if (genders.includes('female')) displayTags.push('Betina')
    }
    if (tags.includes('trotolan')) displayTags.push('Trotol')
    if (tags.includes('dewasa')) displayTags.push('Dewasa')
    if (tags.includes('gacor')) displayTags.push('Gacor')
    
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      price: post.price ? new Intl.NumberFormat('id-ID').format(post.price) : "Hubungi Kami",
      tags: displayTags.length > 0 ? displayTags : ['Burung Premium'],
      image_url: firstBirdImage || "https://placehold.co/800x600?text=No+Image",
      badge
    }
  })

  // Fallback if no data
  if (birds.length === 0) {
    return (
      <section id="collection" className="py-16 md:py-24 bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <span className="text-emerald-600 font-bold tracking-widest text-xs md:text-sm uppercase mb-2 block">Katalog Premium</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-emerald-900 mb-4">Stok Burung Kami</h2>
          <p className="text-gray-600 mt-2 md:mt-4 text-base md:text-lg mb-8">Belum ada koleksi tersedia saat ini. Silakan cek kembali nanti.</p>
          <Link href="/collection" className="inline-flex items-center gap-2 bg-emerald-700 text-white px-6 py-3 rounded-full font-bold hover:bg-emerald-800 transition">
            Lihat Semua Koleksi <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section id="collection" className="py-16 md:py-24 bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16 gap-4">
          <div className="text-center md:text-left w-full md:w-auto">
            <span className="text-emerald-600 font-bold tracking-widest text-xs md:text-sm uppercase mb-2 block">Katalog Premium</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-emerald-900">Stok Burung Terbaru</h2>
            <p className="text-gray-600 mt-2 md:mt-4 text-base md:text-lg">Koleksi burung berkualitas dari penangkaran resmi kami.</p>
          </div>
          <Link href="/collection" className="hidden md:inline-flex items-center gap-2 text-emerald-800 font-bold hover:text-emerald-600 transition group">
            Lihat Semua <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {birds.map((bird) => (
            <Link href={`/collection/${bird.slug}`} key={bird.id} className="group block">
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="relative h-64 md:h-72 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 group-hover:from-black/20 transition"></div>
                  <Image 
                    src={bird.image_url} 
                    alt={bird.title} 
                    fill 
                    className="object-cover transform group-hover:scale-110 transition duration-700" 
                  />
                  <div className={`absolute top-4 right-4 z-20 text-white text-[10px] md:text-xs font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full uppercase tracking-wider shadow-lg ${bird.badge.color}`}>
                    {bird.badge.text}
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 font-serif group-hover:text-emerald-700 transition line-clamp-1">{bird.title}</h3>
                  </div>
                  <p className="text-gray-500 text-xs md:text-sm mb-4 flex flex-wrap gap-2">
                    {bird.tags.map((tag, i) => (
                      <span key={i} className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-medium">{tag}</span>
                    ))}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-xs text-gray-400 block">Harga</span>
                      <span className="text-emerald-700 font-bold text-lg">
                        {bird.price === "Hubungi Kami" ? bird.price : `Rp ${bird.price}`}
                      </span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold group-hover:bg-emerald-700 group-hover:text-white transition">
                      Lihat Detail
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Mobile Only Button */}
        <div className="mt-8 text-center md:hidden">
          <Link href="/collection" className="inline-flex items-center gap-2 bg-emerald-700 text-white px-6 py-3 rounded-full font-bold hover:bg-emerald-800 transition">
            Lihat Semua Koleksi <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
