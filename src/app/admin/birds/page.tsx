import { BirdActions } from "@/components/admin/birds/BirdActions"
import { BirdFilters } from "@/components/admin/birds/BirdFilters"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus, Bird, Calendar, Hash } from "lucide-react"
import { getBirds } from "@/actions/birds"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function BirdsPage(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const searchParams = await props.searchParams
  
  const filters = {
      query: searchParams.query,
      gender: searchParams.gender,
      status: searchParams.status,
      startDate: searchParams.startDate,
      endDate: searchParams.endDate
  }

  const birds = await getBirds(filters)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Koleksi Burung</h1>
            <p className="text-gray-500 mt-1">Kelola data inventaris burung farm Anda.</p>
        </div>
        <Button asChild className="bg-emerald-800 hover:bg-emerald-900 text-white rounded-full px-6 shadow-lg shadow-emerald-900/20 transition-all hover:scale-105">
            <Link href="/admin/birds/new">
                <Plus className="w-5 h-5 mr-2" /> Tambah Burung
            </Link>
        </Button>
      </div>

      {/* Filters */}
      <BirdFilters />

      {/* Grid Content */}
      {birds && birds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {birds.map((bird) => (
                <Card key={bird.id} className="group overflow-hidden border-gray-100 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                    {/* Image Area */}
                    <div className="aspect-square relative bg-gray-100 overflow-hidden">
                        {bird.images && bird.images.length > 0 ? (
                            <img 
                                src={bird.images[0]} 
                                alt={bird.code} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-300">
                                <Bird className="w-12 h-12" />
                            </div>
                        )}
                        <div className="absolute top-3 right-3">
                            <BirdActions bird={bird} />
                        </div>
                        <div className="absolute top-3 left-3">
                            <Badge className={`
                                ${bird.status === 'available' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                                ${bird.status === 'sold' ? 'bg-rose-600 hover:bg-rose-700' : ''}
                                ${bird.status === 'booked' ? 'bg-amber-500 hover:bg-amber-600' : ''}
                                ${bird.status === 'deceased' ? 'bg-slate-600 hover:bg-slate-700' : ''}
                                border-none shadow-md capitalize px-2.5 py-0.5 text-white
                            `}>
                                {bird.status}
                            </Badge>
                        </div>
                    </div>

                    {/* Content Area */}
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h3 className="font-bold text-gray-900 line-clamp-1">{bird.species}</h3>
                                <div className="flex items-center gap-1.5 mt-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md w-fit">
                                    <Hash className="w-3 h-3" />
                                    {bird.code}
                                </div>
                            </div>
                            {bird.gender && (
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bird.gender === 'male' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                                    {bird.gender === 'male' ? '♂' : '♀'}
                                </div>
                            )}
                        </div>
                        
                        <div className="space-y-2 mt-4">
                            <div className="flex items-center text-xs text-gray-500 gap-2">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Lahir: {bird.birth_date ? new Date(bird.birth_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</span>
                            </div>
                             <div className="flex items-center text-xs text-gray-500 gap-2">
                                <span className="font-semibold text-gray-700">IDR</span>
                                <span>{bird.price ? new Intl.NumberFormat('id-ID').format(bird.price) : 'Hubungi Admin'}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
          </div>
      ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bird className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Belum ada data burung</h3>
              <p className="text-gray-500 max-w-sm mx-auto mt-2 mb-6">Mulai tambahkan koleksi burung Anda untuk menampilkannya di website.</p>
              <Button asChild className="bg-emerald-800 text-white rounded-full">
                <Link href="/admin/birds/new">
                    <Plus className="w-4 h-4 mr-2" /> Tambah Pertama
                </Link>
              </Button>
          </div>
      )}
    </div>
  )
}
