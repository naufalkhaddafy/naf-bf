
import { BirdForm } from "@/components/admin/birds/BirdForm"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewBirdPage() {
  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/admin/birds">
                <ArrowLeft className="w-5 h-5 text-gray-500" />
            </Link>
        </Button>
        <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">Tambah Koleksi Baru</h1>
            <p className="text-gray-500 text-sm">Isi data lengkap burung untuk inventaris dan postingan.</p>
        </div>
      </div>

      <BirdForm />
    </div>
  )
}
