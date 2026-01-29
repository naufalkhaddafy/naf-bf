"use client"

import { ShieldCheck, Music, FileCheck, Award, Users, Heart, Headset } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export function Features() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const features = [
    {
      icon: ShieldCheck,
      color: "emerald",
      title: "Garansi DNA & Sehat",
      description: "Jaminan jenis kelamin (DNA Sexing) akurat dan burung bebas cacat fisik. Sertifikat resmi farm disertakan."
    },
    {
      icon: Music,
      color: "amber",
      title: "Kualitas Suara Premium",
      description: "Indukan kami dipilih khusus yang memiliki karakter suara panjang, menggulung, dan volume tembus."
    },
    {
      icon: Headset,
      color: "blue",
      title: "Layanan Purna Jual & Konsultasi",
      description: "Bimbingan perawatan gratis seumur hidup, konsultasi kendala burung, dan jaminan kepuasan pelanggan."
    }
  ]

  const stats = [
    { icon: Award, value: "10+", label: "Tahun Pengalaman" },
    { icon: Users, value: "500+", label: "Pelanggan Puas" },
    { icon: Heart, value: "100%", label: "Garansi Kepuasan" }
  ]

  const colorClasses = {
    emerald: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      hover: "group-hover:bg-emerald-700 group-hover:text-white",
      border: "border-emerald-200"
    },
    amber: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      hover: "group-hover:bg-amber-500 group-hover:text-white",
      border: "border-amber-200"
    },
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      hover: "group-hover:bg-blue-600 group-hover:text-white",
      border: "border-blue-200"
    }
  }

  return (
    <section ref={sectionRef} id="about" className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className={cn(
          "text-center mb-16 md:mb-20 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          <span className="inline-block bg-emerald-100 text-emerald-700 font-bold tracking-widest text-xs md:text-sm uppercase px-4 py-2 rounded-full mb-4">
            Tentang Kami
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
            Kenapa Memilih <br className="md:hidden" />
            <span className="text-emerald-700"><span className="text-yellow-500">NAF</span> <span className="text-emerald-700">Aviary</span>?</span>
          </h2>
          <div className="w-16 md:w-24 h-1 md:h-1.5 bg-gradient-to-r from-emerald-500 to-amber-500 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-6 max-w-2xl mx-auto text-base md:text-lg leading-relaxed px-2">
            Kami tidak sekadar menjual burung, tapi memberikan dedikasi pelestarian dengan kualitas suara dan postur terbaik untuk Anda.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-24">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const colors = colorClasses[feature.color as keyof typeof colorClasses]
            
            return (
              <div 
                key={index} 
                className={cn(
                  "bg-white p-8 md:p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 text-center border border-gray-100 group hover:-translate-y-2",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                )}
                style={{ transitionDelay: `${index * 100 + 200}ms` }}
              >
                <div className={cn(
                  "w-18 h-18 md:w-20 md:h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 md:mb-8 transition-all duration-300 transform group-hover:rotate-6 group-hover:scale-110 border-2",
                  colors.bg, colors.text, colors.hover, colors.border
                )}>
                  <Icon className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-gray-800 group-hover:text-emerald-700 transition-colors">{feature.title}</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>

        {/* Stats Bar */}
        <div className={cn(
          "bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 rounded-3xl p-8 md:p-12 shadow-2xl transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )} style={{ transitionDelay: "500ms" }}>
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <Icon className="w-6 h-6 md:w-8 md:h-8 text-amber-400 mx-auto mb-2 md:mb-3" />
                  <h4 className="text-2xl md:text-4xl font-bold text-white mb-1">{stat.value}</h4>
                  <p className="text-[10px] md:text-xs text-emerald-200 uppercase tracking-wider">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
