import Link from "next/link"
import Image from "next/image"
import { Star, User } from "lucide-react"

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-emerald-900 text-white relative overflow-hidden">
      {/* Decoration */}
      <div className="absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-emerald-800 rounded-full mix-blend-screen filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-gold-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-10 md:mb-16">
          <span className="text-gold-400 font-bold tracking-widest text-xs md:text-sm uppercase mb-2 block">Testimoni</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Kata Sahabat Kicau Mania</h2>
          <p className="text-emerald-200 max-w-xl mx-auto text-base md:text-lg">Kepercayaan Anda adalah motivasi kami untuk terus menjaga kualitas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Testi 1 */}
          <div className="bg-white/5 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition duration-300">
            <div className="flex text-gold-400 mb-4 md:mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-current" />
              ))}
            </div>
            <p className="italic text-gray-200 text-sm md:text-base mb-4 md:mb-6 leading-relaxed">&quot;Alhamdulillah, sepasang anakan Cucak Rowo dari Naf Aviary sehat walafiat. Sertifikat DNA-nya juga lengkap. Makasih Om!&quot;</p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-full flex items-center justify-center border-2 border-gold-500/50 text-gold-400">
                   <User className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm md:text-base">Pak Haji Salam</h4>
                <p className="text-[10px] md:text-xs text-emerald-300 uppercase tracking-wide">Malang, Jatim</p>
              </div>
            </div>
          </div>

          {/* Testi 2 */}
          <div className="bg-white/5 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition duration-300">
            <div className="flex text-gold-400 mb-4 md:mb-6">
              {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-current" />
              ))}
            </div>
            <p className="italic text-gray-200 text-sm md:text-base mb-4 md:mb-6 leading-relaxed">&quot;Suara ropelnya istimewa, benar-benar menggulung. Worth it banget dengan harganya. Kualitas berbicara.&quot;</p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-full flex items-center justify-center border-2 border-gold-500/50 text-gold-400">
                   <User className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm md:text-base">Ibu Laras</h4>
                <p className="text-[10px] md:text-xs text-emerald-300 uppercase tracking-wide">Yogyakarta</p>
              </div>
            </div>
          </div>

           {/* Testi 3 */}
           <div className="bg-white/5 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition duration-300 hidden lg:block">
              <div className="flex text-gold-400 mb-4 md:mb-6">
                  {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                  ))}
              </div>
              <p className="italic text-gray-200 text-sm md:text-base mb-4 md:mb-6 leading-relaxed">&quot;Pengiriman ke luar pulau aman. Packing kayunya rapi. Burung sampai masih lincah. Recommended buat yang cari indukan.&quot;</p>
              <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-full flex items-center justify-center border-2 border-gold-500/50 text-gold-400">
                       <User className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                      <h4 className="font-bold text-white text-sm md:text-base">Ko Deni</h4>
                      <p className="text-[10px] md:text-xs text-emerald-300 uppercase tracking-wide">Medan, Sumut</p>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </section>
  )
}
