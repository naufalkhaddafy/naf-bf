import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, Clock, Bird } from "lucide-react"

export function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-white pt-16 md:pt-20 pb-8 md:pb-10 border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-10 md:mb-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-800 rounded-full flex items-center justify-center text-white ring-2 ring-gold-500/30 overflow-hidden">
                <Image 
                  src="/icon/icon.png" 
                  alt="Naf Bird Farm Logo" 
                  width={48} 
                  height={48} 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="font-serif font-bold text-xl md:text-2xl tracking-wide text-yellow-400">NAF</h2>
                <p className="text-[8px] md:text-[10px] text-white-400 tracking-[0.2em] -mt-1 font-bold">BIRD FARM</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 md:mb-8">
              Pusat penangkaran Cucak Rowo (Straw-headed Bulbul) legal dan berkualitas. Melestarikan kekayaan alam Indonesia dengan integritas dan profesionalisme.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gold-500 hover:text-white transition transform hover:scale-110">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gold-500 hover:text-white transition transform hover:scale-110">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gold-500 hover:text-white transition transform hover:scale-110">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 md:mb-8 text-white border-b border-gray-800 pb-3 md:pb-4 inline-block">Navigasi</h3>
            <ul className="space-y-3 md:space-y-4 text-gray-400 text-sm">
              <li>
                <Link href="/#home" className="hover:text-gold-400 transition flex items-center gap-3 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 group-hover:bg-gold-400 transition"></span> Beranda
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-gold-400 transition flex items-center gap-3 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 group-hover:bg-gold-400 transition"></span> Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/collection" className="hover:text-gold-400 transition flex items-center gap-3 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 group-hover:bg-gold-400 transition"></span> Koleksi Burung
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gold-400 transition flex items-center gap-3 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 group-hover:bg-gold-400 transition"></span> Syarat & Garansi
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 md:mb-8 text-white border-b border-gray-800 pb-3 md:pb-4 inline-block">Hubungi Kami</h3>
            <ul className="space-y-4 md:space-y-5 text-gray-400 text-sm">
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-gold-500 mt-1 shrink-0" />
                <span className="leading-relaxed">Jl. Merpati No. 88, Kecamatan Kicau,<br />Kota Sejuk, Indonesia 40123</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-gold-500 shrink-0" />
                <span className="font-semibold text-white tracking-wide">+62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-gold-500 shrink-0" />
                <span>info@nafbirdfarm.com</span>
              </li>
              <li className="flex items-center gap-4">
                <Clock className="w-5 h-5 text-gold-500 shrink-0" />
                <span>Senin - Minggu: 08.00 - 17.00 WIB</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-600 text-xs flex flex-col md:flex-row justify-between items-center gap-2">
          <p>&copy; 2024 Naf Bird Farm. All rights reserved.</p>
          <p>Dibuat dengan dedikasi untuk Kicau Mania.</p>
        </div>
      </div>
    </footer>
  )
}
