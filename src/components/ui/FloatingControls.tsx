"use client"

import { useEffect, useState } from "react"
import { ArrowUp, MessageCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { ContactButton } from "@/components/ui/ContactButton"

export function FloatingControls() {
  const [showScroll, setShowScroll] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Show scroll button after 300px
      if (window.scrollY > 300) {
        setShowScroll(true)
      } else {
        setShowScroll(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <>
      {/* WhatsApp Button */}
      {/* 
          Logic: 
          - Default (Top of page): bottom-6 (Mepet bawah)
          - Scrolled (>300px): bottom-20 md:bottom-24 (Naik ke atas ScrollToTop)
      */}
      <div 
        className={cn(
            "fixed right-6 z-50 transition-all duration-500 ease-in-out", 
            showScroll ? "bottom-20 md:bottom-24" : "bottom-6"
        )}
      >
        <ContactButton asChild message="Halo NAF Aviary, saya ingin tanya seputar Farm.">
            <motion.button
                whileHover={{ scale: 1.1 }}
                animate={{ 
                    y: [0, -10, 0],
                }}
                transition={{
                    y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                }}
                className="group relative flex items-center justify-center bg-[#25D366] text-white p-3 md:p-4 rounded-full shadow-2xl hover:bg-[#20b858] transition-colors"
            >
                {/* Ripple Effect */}
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75 duration-1000"></span>
                
                <MessageCircle className="relative w-6 h-6 md:w-8 md:h-8 fill-current" />
                
                {/* Tooltip text on hover */}
                <span className="absolute right-full mr-4 bg-white text-emerald-900 px-3 py-1 rounded-lg text-xs md:text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Chat WhatsApp
                </span>
            </motion.button>
        </ContactButton>
      </div>

      {/* Scroll To Top Button */}
      {/* Only visible when scrolled */}
      <div className={cn(
          "fixed bottom-6 right-6 z-40 transition-all duration-500 ease-in-out",
          showScroll ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      )}>
        <button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-emerald-600 text-white shadow-lg transition-all duration-300 hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 border border-emerald-500"
            aria-label="Scroll to top"
        >
            <ArrowUp className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
    </>
  )
}
