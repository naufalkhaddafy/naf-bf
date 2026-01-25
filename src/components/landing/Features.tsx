import { ShieldCheck, Music, FileCheck } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: ShieldCheck,
      color: "emerald",
      title: "Garansi DNA & Sehat",
      description: "Jaminan jenis kelamin (DNA Sexing) akurat dan burung bebas cacat fisik. Sertifikat resmi farm disertakan."
    },
    {
      icon: Music,
      color: "gold",
      title: "Kualitas Suara Ropel",
      description: "Indukan kami dipilih khusus yang memiliki karakter suara ropel panjang, menggulung, dan volume tembus."
    },
    {
      icon: FileCheck,
      color: "blue",
      title: "Legalitas Resmi",
      description: "Naf Bird Farm adalah penangkaran resmi terdaftar BKSDA. Aman, legal, dan mendukung pelestarian alam."
    }
  ]

  return (
    <section id="about" className="py-16 md:py-24 bg-white relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-20">
          <span className="text-emerald-600 font-bold tracking-widest text-xs md:text-sm uppercase mb-2 block">Kenapa Kami?</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-emerald-900 mb-4 md:mb-6 leading-tight">Standar Kualitas <br className="md:hidden" />Naf Bird Farm</h2>
          <div className="w-16 md:w-24 h-1 md:h-1.5 bg-gold-500 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 md:mt-6 max-w-2xl mx-auto text-base md:text-lg leading-relaxed px-2">
            Kami tidak sekadar menjual burung, tapi memberikan dedikasi pelestarian dengan kualitas suara dan postur terbaik untuk Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {features.map((feature, index) => {
            const Icon = feature.icon
            
            // Dynamic classes based on color for the icon container
            const colorClasses = {
              emerald: "bg-emerald-100 text-emerald-800 group-hover:bg-emerald-800 group-hover:text-white",
              gold: "bg-gold-100 text-gold-600 group-hover:bg-gold-500 group-hover:text-white",
              blue: "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
            }

            return (
              <div key={index} className="bg-gray-50 p-6 md:p-10 rounded-3xl shadow-sm hover:shadow-2xl transition duration-300 text-center border border-gray-100 group hover:-translate-y-2">
                <div className={`w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full flex items-center justify-center mb-6 md:mb-8 transition duration-300 transform group-hover:rotate-12 ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
