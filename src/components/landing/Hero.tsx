import Link from "next/link"
import Image from "next/image"
import { Award, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 bg-black">
        <Image
          src="https://images.unsplash.com/photo-1452570053594-1b985d6ea890?q=80&w=1920&auto=format&fit=crop"
          alt="Background Hutan"
          fill
          priority
          className="object-cover opacity-60 animate-slow-zoom"
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-emerald-950/50 to-emerald-900"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center mt-8 md:mt-10">
        
        {/* Trust Badge */}
        <div className="inline-flex items-center gap-3 py-2 md:py-3 px-5 md:px-7 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-gold-100 text-[10px] md:text-xs font-medium mb-8 md:mb-10 animate-fade-in-down shadow-2xl ring-1 ring-white/10 tracking-[0.2em] uppercase">
          <Award className="w-3 h-3 md:w-4 md:h-4 text-gold-400 fill-current shrink-0" />
          <span>Official BKSDA Certified</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-white mb-6 md:mb-8 animate-fade-in-up px-2">
          <span className="block text-4xl sm:text-5xl md:text-7xl italic font-light text-white/90 mb-2 md:mb-4 tracking-wide">Keindahan</span>
          <span className="block text-5xl sm:text-7xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-emerald-100 via-white to-emerald-300 tracking-tighter leading-none filter drop-shadow-lg">SUARA ALAM</span>
          <span className="block mt-4 md:mt-6 text-sm sm:text-lg md:text-xl font-sans font-light tracking-[0.3em] text-gold-200/80 uppercase">Harmoni Di Rumah Anda</span>
        </h1>

        {/* Subhead */}
        <div className="flex items-center justify-center gap-4 mb-10 md:mb-14 animate-fade-in-up delay-100">
          <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-gold-500/50"></span>
          <p className="text-emerald-100/80 text-xs md:text-base font-light max-w-lg leading-relaxed tracking-wider text-center">
            Kurasi Spesial <span className="text-gold-300 font-medium">Cucak Rowo Ropel</span> & Burung Kicau Premium. <br className="hidden md:block" /> Genetik Murni. Rawatan Profesional.
          </p>
          <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-gold-500/50"></span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center animate-fade-in-up delay-200 px-6">
          <Link href="/collection" className="group relative px-8 py-4 bg-gold-500 text-white text-xs md:text-sm font-bold tracking-[0.1em] uppercase rounded-full shadow-[0_0_40px_-10px_rgba(234,179,8,0.3)] hover:shadow-[0_0_60px_-15px_rgba(234,179,8,0.5)] transition-all duration-500 transform hover:-translate-y-1 overflow-hidden w-full sm:w-auto text-center border border-gold-400/50">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
            <span className="relative z-10 flex items-center justify-center gap-3">
              Eksplorasi Koleksi
            </span>
          </Link>
          <a href="https://wa.me/6281234567890" className="group px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs md:text-sm font-medium tracking-[0.1em] uppercase rounded-full transition-all duration-300 flex items-center justify-center gap-3 hover:border-white/40 w-full sm:w-auto text-center">
            <span>Konsultasi</span>
          </a>
        </div>

        {/* Hero Stats */}
        <div className="mt-16 md:mt-24 border-t border-white/5 pt-8 md:pt-12 animate-fade-in-up delay-300 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <h4 className="text-2xl md:text-3xl font-serif text-white mb-1">10<span className="text-gold-400 text-lg">+</span></h4>
              <p className="text-[9px] md:text-[10px] text-white/40 uppercase tracking-[0.2em]">Tahun</p>
            </div>
            <div className="text-center">
              <h4 className="text-2xl md:text-3xl font-serif text-white mb-1">500<span className="text-gold-400 text-lg">+</span></h4>
              <p className="text-[9px] md:text-[10px] text-white/40 uppercase tracking-[0.2em]">Teradopsi</p>
            </div>
             <div className="text-center">
                <h4 className="text-2xl md:text-3xl font-serif text-white mb-1">100<span className="text-gold-400 text-lg">%</span></h4>
                <p className="text-[9px] md:text-[10px] text-white/40 uppercase tracking-[0.2em]">Garansi DNA</p>
            </div>
             <div className="text-center">
                <h4 className="text-2xl md:text-3xl font-serif text-white mb-1 flex justify-center items-center gap-2">4.9</h4>
                <p className="text-[9px] md:text-[10px] text-white/40 uppercase tracking-[0.2em]">Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20 opacity-70 hover:opacity-100 transition hidden md:block">
        <Link href="/#about" className="flex flex-col items-center gap-2 text-white/80 hover:text-gold-400 transition">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-6 h-6" />
        </Link>
      </div>
    </section>
  )
}
