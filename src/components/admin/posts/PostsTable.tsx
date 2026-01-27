"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Package, Loader2 } from "lucide-react"
import { PostActions } from "./PostActions"
import { getPosts } from "@/actions/posts"

const INITIAL_LIMIT = 20
const LOAD_MORE_LIMIT = 10

export function PostsTable() {
  const searchParams = useSearchParams()
  const [posts, setPosts] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [offset, setOffset] = useState(0)

  // Get filter params
  const query = searchParams.get("query") || ""
  const status = searchParams.get("status") || ""
  const startDate = searchParams.get("startDate") || ""
  const endDate = searchParams.get("endDate") || ""
  const minPrice = searchParams.get("minPrice") || ""
  const maxPrice = searchParams.get("maxPrice") || ""

  // Initial fetch
  const fetchPosts = useCallback(async (isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true)
    } else {
      setLoading(true)
      setOffset(0)
    }

    const newOffset = isLoadMore ? offset + LOAD_MORE_LIMIT : 0
    const limit = isLoadMore ? LOAD_MORE_LIMIT : INITIAL_LIMIT

    const result = await getPosts({
      query,
      status,
      startDate,
      endDate,
      minPrice,
      maxPrice,
      offset: newOffset,
      limit
    })

    if (isLoadMore) {
      setPosts(prev => [...prev, ...result.posts])
      setOffset(newOffset)
    } else {
      setPosts(result.posts)
      setOffset(0)
    }
    setTotal(result.total)
    setLoading(false)
    setLoadingMore(false)
  }, [query, status, startDate, endDate, minPrice, maxPrice, offset])

  // Refetch when filters change
  useEffect(() => {
    fetchPosts(false)
  }, [query, status, startDate, endDate, minPrice, maxPrice])

  const loadMore = () => {
    fetchPosts(true)
  }

  const hasMore = posts.length < total

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">Post</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">Burung</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">Tags</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">Harga</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">Status</th>
                <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.length > 0 ? (
                posts.map((post: any) => (
                  <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                          {post.post_birds?.[0]?.birds?.images?.[0] ? (
                            <img src={post.post_birds[0].birds.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">{post.title}</h3>
                          <p className="text-xs text-gray-400 mt-0.5 font-mono">{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {post.post_birds?.map((pb: any, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border-emerald-200">
                            {pb.birds?.code || 'N/A'}
                          </Badge>
                        ))}
                        {(!post.post_birds || post.post_birds.length === 0) && (
                          <span className="text-xs text-gray-400 italic">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {post.tags?.map((tag: string, idx: number) => (
                          <Badge key={idx} variant="outline" className={`text-[10px] px-2 py-0.5 capitalize ${
                            tag === 'trotolan' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                            tag === 'dewasa' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            tag === 'indukan_produk' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-gray-50 text-gray-600 border-gray-200'
                          }`}>
                            {tag.replace('_', ' ')}
                          </Badge>
                        ))}
                        {(!post.tags || post.tags.length === 0) && (
                          <span className="text-xs text-gray-400 italic">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        {post.price ? `Rp ${Number(post.price).toLocaleString('id-ID')}` : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`capitalize text-[10px] px-2.5 py-1 border-none shadow-sm ${
                        post.status === 'available' ? 'bg-emerald-600 text-white' :
                        post.status === 'sold' ? 'bg-rose-600 text-white' :
                        post.status === 'booked' ? 'bg-amber-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {post.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild className="text-gray-400 hover:text-emerald-600 rounded-full">
                          <Link href={`/collection/${post.slug}`} target="_blank">
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <PostActions postId={post.id} postTitle={post.title} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">Belum ada post</h3>
                      <p className="text-sm text-gray-500">Mulai buat post pertama untuk menjual burung</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
              `Muat Lebih Banyak (${posts.length}/${total})`
            )}
          </Button>
        </div>
      )}

      {/* Result count */}
      {posts.length > 0 && (
        <p className="text-center text-sm text-gray-500">
          Menampilkan {posts.length} dari {total} post
        </p>
      )}
    </div>
  )
}
