"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

import { Menu, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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

  return (
    <nav
      className={cn(
        "fixed w-full z-50 transition-all duration-300",
        scrolled ? "bg-emerald-900/95 backdrop-blur-md py-2 shadow-lg" : "bg-emerald-900 py-3 md:py-4"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center relative">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 md:gap-3 group z-50 relative">
          <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white rounded-full text-emerald-900 shadow-md group-hover:scale-105 transition-transform border-2 border-gold-500 overflow-hidden">
            <Image 
              src="/icon/icon.png" 
              alt="Naf Bird Farm Logo" 
              width={48} 
              height={48} 
              className="w-full h-full object-contain p-0.5"
            />
          </div>
          <div>
            <h1 className="font-bold text-lg md:text-xl tracking-wide leading-none font-serif text-gold-400">NAF</h1>
            <p className="text-[8px] md:text-[10px] text-gray-200 font-medium tracking-[0.3em]">BIRD FARM</p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center font-medium text-white text-sm tracking-wide">
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
          <Button 
            className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white px-6 py-2.5 rounded-full transition shadow-lg hover:shadow-gold-500/30 flex items-center gap-2 transform hover:-translate-y-0.5"
            onClick={() => window.open("https://wa.me/6281234567890", "_blank")}
            asChild
          >
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
              <Phone className="w-4 h-4" /> Kontak
            </a>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none hover:text-gold-400 transition p-2 z-50 relative"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="w-7 h-7" />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={cn(
          "md:hidden bg-emerald-950 border-t border-emerald-800 absolute w-full left-0 top-full shadow-2xl transition-all duration-300 overflow-hidden",
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="flex flex-col py-2 text-white">
          <Link href="/#home" className="block py-4 px-6 hover:bg-emerald-800 border-b border-emerald-800/30 text-sm font-medium" onClick={() => setIsOpen(false)}>
            Beranda
          </Link>
          <Link href="/#about" className="block py-4 px-6 hover:bg-emerald-800 border-b border-emerald-800/30 text-sm font-medium" onClick={() => setIsOpen(false)}>
            Tentang Kami
          </Link>
          <Link href="/collection" className="block py-4 px-6 hover:bg-emerald-800 border-b border-emerald-800/30 text-sm font-medium" onClick={() => setIsOpen(false)}>
            Koleksi Burung
          </Link>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="block py-4 px-6 hover:bg-emerald-800 text-gold-400 font-bold text-sm"
            onClick={() => setIsOpen(false)}
          >
            Hubungi Kami
          </a>
        </div>
      </div>
    </nav>
  )
}
