import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { PlusCircle, Package, TrendingUp } from "lucide-react"
import { PostFilters } from "@/components/admin/posts/PostFilters"
import { PostsTable } from "@/components/admin/posts/PostsTable"

export default async function PostsPage() {
  const supabase = await createClient()

  // Fetch stats only (not paginated data, that's handled by client component)
  const { count: totalPosts } = await supabase.from('posts').select('*', { count: 'exact', head: true })
  const { count: availablePosts } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'available')
  const { count: soldPosts } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'sold')

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Marketplace Posts</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola postingan burung untuk dijual</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white shadow-lg shadow-emerald-900/20 rounded-full px-6">
          <Link href="/admin/posts/new">
            <PlusCircle className="w-4 h-4 mr-2" /> Buat Post Baru
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalPosts || 0}</p>
              <p className="text-xs text-gray-500">Total Posts</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{availablePosts || 0}</p>
              <p className="text-xs text-gray-500">Tersedia</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{soldPosts || 0}</p>
              <p className="text-xs text-gray-500">Terjual</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <PostFilters />

      {/* Posts Table with Lazy Loading */}
      <PostsTable />
    </div>
  )
}
