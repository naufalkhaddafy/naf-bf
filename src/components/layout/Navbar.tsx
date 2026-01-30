"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

import { Menu, Phone, X, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ContactButton } from "@/components/ui/ContactButton"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [favCount, setFavCount] = useState(0)
  const pathname = usePathname()
  
  // Only allow transparent navbar on homepage
  const isHomePage = pathname === "/"
  const showSolidNav = scrolled || !isHomePage

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const updateFavCount = () => {
      const saved = localStorage.getItem("naf_favorites")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed)) {
            setFavCount(parsed.length)
          }
        } catch (e) {
          setFavCount(0)
        }
      } else {
        setFavCount(0)
      }
    }

    updateFavCount()
    window.addEventListener("favorites-updated", updateFavCount)
    window.addEventListener("storage", updateFavCount)

    return () => {
      window.removeEventListener("favorites-updated", updateFavCount)
      window.removeEventListener("storage", updateFavCount)
    }
  }, [])

  return (
    <nav
      className={cn(
        "fixed w-full z-50 transition-all duration-500 ease-in-out",
        showSolidNav 
          ? "bg-emerald-900/95 backdrop-blur-lg py-3 shadow-xl" 
          : "bg-transparent py-4 md:py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center relative">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 md:gap-3 group z-50 relative">
          <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full shadow-lg group-hover:scale-105 transition-all duration-300 overflow-hidden border-2 border-yellow-500 bg-white">
            <Image 
              src="/icon/icon.png" 
              alt="Naf Aviary Logo" 
              width={48} 
              height={48} 
              className="w-full h-full object-contain p-0.5"
            />
          </div>
          <div>
            <h1 className="font-bold text-lg md:text-xl tracking-wide leading-none font-serif text-yellow-400 transition-colors duration-300">NAF</h1>
            <p className="text-[8px] md:text-[10px] font-medium tracking-[0.3em] text-gray-200 transition-colors duration-300">AVIARY</p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center font-medium text-sm tracking-wide text-white transition-colors duration-300">
          <Link href="/#home" className="hover:text-gold-400 transition relative group">
            Beranda
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-400 transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/#about" className="hover:text-gold-400 transition relative group">
            Tentang Kami
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-400 transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/collection" className="hover:text-gold-400 transition relative group">
            Koleksi Burung
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-400 transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/favorites" className="hover:text-gold-400 transition relative group flex items-center gap-2">
            <div className="relative">
                <Heart className={cn("w-5 h-5", favCount > 0 && "fill-current text-gold-400")} />
                {favCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-sm animate-in zoom-in">
                        {favCount}
                    </span>
                )}
            </div>
            <span className="md:hidden lg:inline">Favorit</span>
          </Link>
          <ContactButton asChild message="Halo NAF Aviary, saya ingin tanya seputar Farm.">
            <Button 
              className="bg-yellow-500 hover:bg-yellow-400 text-emerald-900 font-bold px-6 py-2.5 rounded-full transition-all shadow-lg hover:shadow-yellow-500/40 flex items-center gap-2 transform hover:-translate-y-0.5 hover:scale-105 cursor-pointer"
            >
              <Phone className="w-4 h-4" /> Kontak
            </Button>
          </ContactButton>
        </div>

        {/* Mobile Header Actions */}
        <div className="md:hidden flex items-center gap-1">
            <Link href="/favorites" className="p-2 text-white hover:text-yellow-400 relative transition-colors z-50">
                <Heart className={cn("w-6 h-6", favCount > 0 && "fill-current text-gold-400")} />
                {favCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-sm border border-emerald-900 animate-in zoom-in">
                        {favCount}
                    </span>
                )}
            </Link>

            <button
            className="focus:outline-none transition-all p-2 z-50 relative text-white hover:text-yellow-400"
            onClick={() => setIsOpen(!isOpen)}
            >
            <div className={cn("transition-transform duration-300", isOpen && "rotate-90")}>
                {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </div>
            </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={cn(
          "md:hidden bg-gradient-to-b from-emerald-900 to-emerald-950 absolute w-full left-0 top-full shadow-2xl transition-all duration-500 ease-out overflow-hidden",
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="flex flex-col py-4 px-4 space-y-1">
          <Link 
            href="/#home" 
            className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-white/10 text-white font-medium transition-all duration-200 group" 
            onClick={() => setIsOpen(false)}
          >
            <span className="w-8 h-8 bg-emerald-800 rounded-lg flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-emerald-900 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            </span>
            <span className="group-hover:text-yellow-400 transition-colors">Beranda</span>
          </Link>
          <Link 
            href="/#about" 
            className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-white/10 text-white font-medium transition-all duration-200 group" 
            onClick={() => setIsOpen(false)}
          >
            <span className="w-8 h-8 bg-emerald-800 rounded-lg flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-emerald-900 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </span>
            <span className="group-hover:text-yellow-400 transition-colors">Tentang Kami</span>
          </Link>
          <Link 
            href="/collection" 
            className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-white/10 text-white font-medium transition-all duration-200 group" 
            onClick={() => setIsOpen(false)}
          >
            <span className="w-8 h-8 bg-emerald-800 rounded-lg flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-emerald-900 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </span>
            <span className="group-hover:text-yellow-400 transition-colors">Koleksi Burung</span>
          </Link>
          <Link 
            href="/favorites" 
            className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-white/10 text-white font-medium transition-all duration-200 group" 
            onClick={() => setIsOpen(false)}
          >
            <span className="w-8 h-8 bg-emerald-800 rounded-lg flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-emerald-900 transition-colors relative">
              <Heart className={cn("w-4 h-4", favCount > 0 && "fill-current text-white")} />
              {favCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">
                    {favCount}
                  </span>
              )}
            </span>
            <span className="group-hover:text-yellow-400 transition-colors">Favorit Saya</span>
          </Link>
          
          {/* CTA Button */}
          <div className="pt-3 mt-2 border-t border-emerald-800/50">
            <ContactButton asChild message="Halo NAF Aviary, saya ingin tanya seputar Farm.">
              <button
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-yellow-500 hover:bg-yellow-400 text-emerald-900 font-bold rounded-xl transition-all duration-200 shadow-lg cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                <Phone className="w-5 h-5" />
                Hubungi Kami via WhatsApp
              </button>
            </ContactButton>
          </div>
        </div>
      </div>
    </nav>
  )
}
