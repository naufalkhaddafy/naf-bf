"use client"

import { useState } from "react"
import Image from "next/image"
import { PlayCircle, Calendar, Dna, Star, Copy, Heart, Share2, ShieldCheck, Truck, FileCheck, Check, Activity, Youtube, Music, Headphones, Play, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LeadDialog } from "@/components/collection/LeadDialog"
import { cn } from "@/lib/utils"


// Type definition (can be shared)
type BirdDetailProps = {
  bird: {
    id: string
    title: string
    code: string
    price: string
    originalPrice?: string
    rating: number
    description: string
    specs: {
       label: string
       value: string
    }[]
    images: string[]
    videos: {
        main: string
        others: { title: string, duration: string, thumb: string }[]
    }
    pedigree: {
        f: string
        sire: { name: string, ring: string, type: string, img: string }
        dam: { name: string, ring: string, type: string, img: string }
        grandsire_s: string
        granddam_s: string
        grandsire_d: string
        granddam_d: string
    }
  }
}

export function BirdDetail({ bird }: BirdDetailProps) {
  const [activeTab, setActiveTab] = useState("desc")
  const [mainImage, setMainImage] = useState(bird.images[0])

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        
        {/* Left Column: Image Gallery */}
        <div>
          {/* Main Image */}
          <div className="relative h-[300px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-gray-100 mb-4 md:mb-6 group bg-gray-100 ring-1 ring-gray-900/5">
            <Image 
                src={mainImage} 
                alt={bird.title} 
                fill 
                className="object-cover transition duration-700 hover:scale-105"
                priority
            />
            {/* Status Badge */}
            <div className="absolute top-4 left-4 bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] md:text-xs font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full uppercase tracking-wider shadow-lg border border-emerald-400/30">
              Ready Stock • Siap Pantau
            </div>
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-3 md:gap-4">
             {bird.images.map((img, idx) => (
                <button 
                    key={idx}
                    onClick={() => setMainImage(img)} 
                    className={cn(
                        "h-20 md:h-24 rounded-xl overflow-hidden border-2 transform hover:scale-105 transition-all duration-300 shadow-md focus:outline-none relative",
                        mainImage === img ? "border-emerald-600 opacity-100 ring-2 ring-emerald-500 ring-offset-2" : "border-transparent hover:border-emerald-600 opacity-70 hover:opacity-100"
                    )}
                >
                    <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
                </button>
             ))}
            
            {/* Video Thumbnail Trigger */}
            <div 
                onClick={() => setActiveTab('video')} 
                className="h-20 md:h-24 rounded-xl overflow-hidden bg-gray-900 relative cursor-pointer border-2 border-transparent hover:border-gold-500 group flex items-center justify-center shadow-md transform hover:scale-105 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition"></div>
              <PlayCircle className="w-8 h-8 md:w-10 md:h-10 text-white opacity-80 group-hover:opacity-100 transition relative z-10 drop-shadow-md" />
              <span className="absolute bottom-1 md:bottom-2 text-[8px] md:text-[10px] text-white font-bold tracking-widest z-10">VIDEO</span>
            </div>
          </div>
        </div>

        {/* Right Column: Product Details */}
        <div>
           <div className="mb-6 md:mb-8 border-b border-gray-100 pb-6 md:pb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">Cucak Rowo</span>
              <span className="bg-gold-100 text-gold-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">Ring {bird.code}</span>
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-3 md:mb-4 leading-tight">{bird.title}</h1>
            
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-500 mb-4 md:mb-6">
              <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full"><Calendar className="w-3 h-3 md:w-4 md:h-4 text-gray-400" /> Jan 2023</span>
              <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full text-emerald-700 font-semibold"><Dna className="w-3 h-3 md:w-4 md:h-4" /> Jantan (DNA)</span>
              <span className="flex items-center gap-1 text-gold-500">
                <Star className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                <span className="text-gray-600 font-medium">{bird.rating}</span>
              </span>
            </div>

            <div className="flex items-end gap-3">
              <div className="text-3xl md:text-4xl font-bold text-emerald-800 tracking-tight">{bird.price}</div>
              {bird.originalPrice && <div className="text-base md:text-lg text-gray-400 line-through mb-1.5">{bird.originalPrice}</div>}
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed mb-6 md:mb-8 text-base md:text-lg font-light">
            {bird.description}
          </p>

          <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 mb-6 md:mb-8 shadow-lg shadow-gray-100/50">
             <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-xs md:text-sm uppercase tracking-wider"><Copy className="w-4 h-4 md:w-5 md:h-5 text-gold-500" /> Spesifikasi Burung</h3>
             <div className="grid grid-cols-2 gap-y-3 md:gap-y-4 gap-x-4 md:gap-x-8 text-xs md:text-sm">
                {bird.specs.map((spec, i) => (
                    <div key={i} className="flex flex-col">
                        <span className="text-gray-400 text-[10px] md:text-xs mb-0.5">{spec.label}</span>
                        <span className="font-semibold text-gray-800">{spec.value}</span>
                    </div>
                ))}
             </div>
          </div>



           <div className="flex flex-col gap-3 md:gap-4">
                <LeadDialog 
                    birdTitle={bird.title}
                    className="w-full bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white font-bold py-6 rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 transition-all duration-300 text-base md:text-lg transform hover:-translate-y-1"
                />
                <div className="flex gap-3 md:gap-4">
                    <Button variant="outline" className="flex-1 border-2 py-6 rounded-xl hover:border-gold-400 hover:text-gold-600 gap-2"><Share2 className="w-4 h-4" /> Bagikan</Button>
                    <Button variant="outline" className="flex-1 border-2 py-6 rounded-xl hover:border-red-400 hover:text-red-500 gap-2"><Heart className="w-4 h-4" /> Simpan</Button>
                </div>
            </div>

            <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-3 md:gap-4 text-[10px] md:text-xs text-gray-500 bg-gray-50 py-3 px-4 rounded-lg border border-gray-100">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 md:w-4 md:h-4 text-emerald-600" /> Garansi Sehat</span>
                <span className="w-px h-3 md:h-4 bg-gray-300"></span>
                <span className="flex items-center gap-1.5"><Truck className="w-3 h-3 md:w-4 md:h-4 text-emerald-600" /> Pengiriman Aman</span>
                <span className="w-px h-3 md:h-4 bg-gray-300"></span>
                <span className="flex items-center gap-1.5"><FileCheck className="w-3 h-3 md:w-4 md:h-4 text-emerald-600" /> Dokumen Resmi</span>
            </div>
        </div>
      </div>

       {/* Tabbed Content Section */}
       <div className="mt-16 md:mt-24">
            <div className="border-b border-gray-200 mb-6 md:mb-8 overflow-x-auto">
                <nav className="-mb-px flex space-x-4 md:space-x-8 min-w-max" aria-label="Tabs">
                    {['desc', 'video', 'pedigree'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)} 
                            className={cn(
                                "whitespace-nowrap py-3 md:py-4 px-4 md:px-6 font-bold text-xs md:text-sm transition-all duration-300 rounded-t-lg focus:outline-none",
                                activeTab === tab ? "border-b-2 border-emerald-600 text-emerald-600 bg-emerald-50/50" : "border-transparent text-gray-500 hover:text-emerald-600 hover:bg-gray-50"
                            )}
                        >
                            {tab === 'desc' && 'Deskripsi Lengkap'}
                            {tab === 'video' && 'Video Pantauan'}
                            {tab === 'pedigree' && 'Silsilah (Pedigree)'}
                        </button>
                    ))}
                </nav>
            </div>

             {/* Tab: Deskripsi */}
             {activeTab === 'desc' && (
                 <div className="animate-fade-in-up">
                    <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm max-w-4xl mx-auto">
                        <p className="mb-4 md:mb-6 leading-relaxed text-sm md:text-base text-gray-600">
                            {bird.title} dari Naf Bird Farm merupakan hasil breeding generasi ke-{bird.pedigree.f} (F{bird.pedigree.f}) dari farm kami. Burung ini memiliki mental yang sangat stabil, tidak mudah stres saat dipindah kandang atau dibawa perjalanan jauh. Dilatih sejak trotol dengan masteran pilihan.
                        </p>
                        <p className="mb-4 md:mb-6 leading-relaxed text-sm md:text-base text-gray-600">
                            Keunggulan utama ada pada <strong>irama lagu</strong>. Ropelannya panjang dengan jeda yang rapat. Sangat cocok untuk Anda yang mencari "kelangenan" (peliharaan kesayangan) kelas premium untuk mengisi suasana rumah agar terasa seperti di alam bebas.
                        </p>
                        <div className="bg-gradient-to-br from-emerald-50 to-white p-5 md:p-6 rounded-xl border border-emerald-100 my-4 md:my-6">
                            <h4 className="font-bold text-emerald-900 mb-3 md:mb-4 flex items-center gap-2 text-base md:text-lg"><Activity className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" /> Riwayat Kesehatan & Perawatan</h4>
                            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-700">
                                <li className="flex items-start gap-3"><Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> <span>Vaksinasi ND rutin setiap 6 bulan (Terakhir: Nov 2023).</span></li>
                                <li className="flex items-start gap-3"><Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> <span>Pemberian obat cacing Drontal Cat (dosis sesuaikan) setiap 3 bulan.</span></li>
                                <li className="flex items-start gap-3"><Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> <span>Menu harian: Pisang Kepok putih, Jangkrik 5 (Pagi) / 5 (Sore).</span></li>
                                <li className="flex items-start gap-3"><Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> <span>Mandi keramba setiap pagi pukul 07.00 WIB.</span></li>
                            </ul>
                        </div>
                    </div>
                 </div>
             )}

             {/* Tab: Video */}
             {activeTab === 'video' && (
                 <div className="animate-fade-in-up">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                         <div className="md:col-span-2">
                             <h3 className="font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base"><Youtube className="w-5 h-5 text-red-600" /> Video Utama (Pantauan Pagi)</h3>
                             <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl mb-4 relative ring-4 ring-gray-100">
                                 <iframe className="w-full h-full" src={bird.videos.main} title="Video Burung" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                             </div>
                             <p className="text-xs md:text-sm text-gray-500 italic bg-white p-3 rounded-lg border border-gray-100 inline-block"><Info className="w-4 h-4 inline mr-1" /> Video diambil tanggal 10 Desember 2024, kondisi burung belum mandi.</p>
                         </div>
                         
                         <div>
                             <h3 className="font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base"><Music className="w-5 h-5 text-gold-500" /> Rekaman Suara (Audio)</h3>
                             <div className="bg-white p-4 md:p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4 md:space-y-5">
                                 <div>
                                     <label className="text-[10px] md:text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wide">Suara Ropel Panjang</label>
                                     <audio controls className="w-full h-8 md:h-10 rounded-full bg-gray-50"><source src="#" type="audio/mpeg" />Browser Anda tidak mendukung elemen audio.</audio>
                                 </div>
                                 <div className="mt-4 pt-4 border-t border-gray-100">
                                     <p className="text-xs text-gray-500 flex items-center gap-2"><Headphones className="w-4 h-4 text-emerald-500" /> Gunakan headset untuk mendengar kualitas detail suara.</p>
                                 </div>
                             </div>

                             <h3 className="font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4 text-sm md:text-base">Video Lainnya</h3>
                             <div className="space-y-3">
                                {bird.videos.others.map((vid, i) => (
                                     <div key={i} className="flex gap-3 bg-white p-2 md:p-3 rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-md cursor-pointer transition group">
                                        <div className="w-16 md:w-20 h-12 md:h-14 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative">
                                            <Image src={vid.thumb} alt="thumb" fill className="object-cover group-hover:scale-110 transition" />
                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center"><Play className="w-3 h-3 md:w-4 md:h-4 text-white fill-current" /></div>
                                        </div>
                                        <div>
                                            <h4 className="text-xs md:text-sm font-bold text-gray-800 group-hover:text-emerald-700 transition line-clamp-1">{vid.title}</h4>
                                            <p className="text-[10px] md:text-xs text-gray-500 mt-1">{vid.duration}</p>
                                        </div>
                                    </div>
                                ))}
                             </div>
                         </div>
                      </div>
                 </div>
             )}

             {/* Tab: Pedigree */}
             {activeTab === 'pedigree' && (
                <div className="animate-fade-in-up">
                    <div className="text-center mb-8 md:mb-10">
                        <h3 className="font-bold text-gray-900 text-xl md:text-2xl font-serif">Silsilah Genetik (Family Tree)</h3>
                        <p className="text-xs md:text-sm text-gray-500 mt-2">Menjamin kemurnian trah dan kualitas suara dari indukan jawara.</p>
                    </div>
                    {/* Simplified Tree Implementation (could be extracted to component) */}
                     <div className="max-w-4xl mx-auto overflow-x-auto pb-10">
                         <div className="min-w-[600px] flex flex-col items-center gap-10 md:gap-12 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50">
                             {/* Level 1 */}
                             <div className="relative z-10">
                                 <div className="w-56 md:w-64 bg-emerald-900 text-white p-4 md:p-5 rounded-2xl shadow-xl border-4 border-gold-500 text-center relative z-20">
                                     <div className="absolute -top-3 -right-3 bg-gold-500 text-white text-[9px] font-bold px-2 py-1 rounded-full border-2 border-white">GENERASI F{bird.pedigree.f}</div>
                                     <h4 className="font-bold text-lg md:text-xl mb-1">{bird.code}</h4>
                                     <p className="text-[10px] md:text-xs text-emerald-200 uppercase tracking-widest font-semibold">"Si Ropel Emas"</p>
                                 </div>
                                 <div className="absolute top-full left-1/2 w-0.5 h-12 bg-gray-300 -translate-x-1/2"></div>
                             </div>

                             {/* Level 2 */}
                             <div className="flex justify-center gap-12 md:gap-32 relative w-full">
                                  <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-gray-300 -translate-y-[26px]"></div>
                                  
                                  {/* Sire */}
                                  <div className="flex flex-col items-center relative">
                                      <div className="absolute -top-[26px] h-[26px] w-0.5 bg-gray-300"></div>
                                      <div className="w-40 md:w-52 bg-white p-4 md:p-5 rounded-2xl shadow-md border-2 border-gray-100 text-center">
                                           <span className="absolute top-2 right-2 text-[8px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">SIRE</span>
                                           <h4 className="font-bold text-gray-800 text-base md:text-lg">{bird.pedigree.sire.name}</h4>
                                           <p className="text-[10px] md:text-xs text-gray-500 font-semibold">{bird.pedigree.sire.ring}</p>
                                      </div>
                                       <div className="w-0.5 h-8 bg-gray-300 mx-auto"></div>
                                  </div>

                                  {/* Dam */}
                                  <div className="flex flex-col items-center relative">
                                      <div className="absolute -top-[26px] h-[26px] w-0.5 bg-gray-300"></div>
                                      <div className="w-40 md:w-52 bg-white p-4 md:p-5 rounded-2xl shadow-md border-2 border-gray-100 text-center">
                                           <span className="absolute top-2 right-2 text-[8px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded">DAM</span>
                                           <h4 className="font-bold text-gray-800 text-base md:text-lg">{bird.pedigree.dam.name}</h4>
                                           <p className="text-[10px] md:text-xs text-gray-500 font-semibold">{bird.pedigree.dam.ring}</p>
                                      </div>
                                      <div className="w-0.5 h-8 bg-gray-300 mx-auto"></div>
                                  </div>
                             </div>
                             
                             {/* Level 3 */}
                             <div className="flex justify-center gap-4 md:gap-6 w-full opacity-80">
                                {/* Sire's Parents */}
                                <div className="flex gap-2 relative mr-6 md:mr-24">
                                     <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-gray-300 -translate-y-[18px]"></div>
                                     <div className="absolute -top-[18px] left-1/2 w-0.5 h-[18px] bg-gray-300 -translate-x-1/2"></div>
                                    <div className="w-24 md:w-32 bg-gray-50 p-2 text-center rounded-xl border border-dashed border-gray-300"><p className="text-xs font-bold">{bird.pedigree.grandsire_s}</p></div>
                                    <div className="w-24 md:w-32 bg-gray-50 p-2 text-center rounded-xl border border-dashed border-gray-300"><p className="text-xs font-bold">{bird.pedigree.granddam_s}</p></div>
                                </div>
                                {/* Dam's Parents */}
                                <div className="flex gap-2 relative ml-6 md:ml-24">
                                     <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-gray-300 -translate-y-[18px]"></div>
                                     <div className="absolute -top-[18px] left-1/2 w-0.5 h-[18px] bg-gray-300 -translate-x-1/2"></div>
                                    <div className="w-24 md:w-32 bg-gray-50 p-2 text-center rounded-xl border border-dashed border-gray-300"><p className="text-xs font-bold">{bird.pedigree.grandsire_d}</p></div>
                                    <div className="w-24 md:w-32 bg-gray-50 p-2 text-center rounded-xl border border-dashed border-gray-300"><p className="text-xs font-bold">{bird.pedigree.granddam_d}</p></div>
                                </div>
                             </div>

                         </div>
                     </div>
                </div>
             )}
       </div>
    </div>
  )
}
