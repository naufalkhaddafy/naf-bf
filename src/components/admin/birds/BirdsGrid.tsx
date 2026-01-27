"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Bird, Plus, Calendar, Hash, Loader2 } from "lucide-react"
import { BirdActions } from "./BirdActions"
import { getBirds } from "@/actions/birds"

const INITIAL_LIMIT = 20
const LOAD_MORE_LIMIT = 10

export function BirdsGrid() {
  const searchParams = useSearchParams()
  const [birds, setBirds] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [offset, setOffset] = useState(0)

  // Get filter params
  const query = searchParams.get("query") || ""
  const gender = searchParams.get("gender") || ""
  const status = searchParams.get("status") || ""
  const startDate = searchParams.get("startDate") || ""
  const endDate = searchParams.get("endDate") || ""

  // Fetch birds
  const fetchBirds = useCallback(async (isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true)
    } else {
      setLoading(true)
      setOffset(0)
    }

    const newOffset = isLoadMore ? offset + LOAD_MORE_LIMIT : 0
    const limit = isLoadMore ? LOAD_MORE_LIMIT : INITIAL_LIMIT

    const result = await getBirds({
      query,
      gender,
      status,
      startDate,
      endDate,
      offset: newOffset,
      limit
    })

    if (isLoadMore) {
      setBirds(prev => [...prev, ...result.birds])
      setOffset(newOffset)
    } else {
      setBirds(result.birds)
      setOffset(0)
    }
    setTotal(result.total)
    setLoading(false)
    setLoadingMore(false)
  }, [query, gender, status, startDate, endDate, offset])

  // Refetch when filters change
  useEffect(() => {
    fetchBirds(false)
  }, [query, gender, status, startDate, endDate])

  const loadMore = () => {
    fetchBirds(true)
  }

  const hasMore = birds.length < total

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
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

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button 
            onClick={loadMore} 
            disabled={loadingMore}
            variant="outline" 
            className="rounded-full px-8"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memuat...
              </>
            ) : (
              `Muat Lebih Banyak (${birds.length}/${total})`
            )}
          </Button>
        </div>
      )}

      {/* Result count */}
      {birds.length > 0 && (
        <p className="text-center text-sm text-gray-500">
          Menampilkan {birds.length} dari {total} burung
        </p>
      )}
    </div>
  )
}
