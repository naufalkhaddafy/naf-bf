import { BirdFilters } from "@/components/admin/birds/BirdFilters"
import { BirdsGrid } from "@/components/admin/birds/BirdsGrid"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function BirdsPage() {
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

      {/* Grid Content with Lazy Loading */}
      <BirdsGrid />
    </div>
  )
}
