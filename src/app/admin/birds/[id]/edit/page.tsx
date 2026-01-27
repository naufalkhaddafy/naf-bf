import { BirdForm } from "@/components/admin/birds/BirdForm"
import { getBirdById } from "@/actions/birds"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function EditBirdPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const bird = await getBirdById(params.id)

  if (!bird) {
    notFound()
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/admin/birds">
                <ArrowLeft className="w-5 h-5 text-gray-500" />
            </Link>
        </Button>
        <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">Edit Data Burung</h1>
            <p className="text-gray-500 text-sm">Perbarui informasi data burung di inventaris.</p>
        </div>
      </div>
      
      <BirdForm initialData={bird} />
    </div>
  )
}
