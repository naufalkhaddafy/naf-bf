import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { BirdDetail } from "@/components/collection/BirdDetail"

import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

export default async function BirdDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const supabase = await createClient()

    const { data: birdData, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error || !birdData) {
        notFound()
    }

    // Map DB data to UI format
    const bird = {
        id: birdData.id,
        title: birdData.title,
        code: birdData.code || "NAF-XXX",
        price: birdData.price ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(birdData.price) : "Hubungi Kami",
        originalPrice: undefined, // Fix type mismatch
        rating: 5.0, // Default
        description: birdData.description || birdData.content || "Belum ada deskripsi detail.",
        // Use JSONB columns if valid, else fallback
        specs: Array.isArray(birdData.specs) && birdData.specs.length > 0 ? birdData.specs : [
            { label: "Kode Ring", value: birdData.code || "NAF-XXX" },
            { label: "Jenis Kelamin", value: (birdData.tags && birdData.tags.includes('Jantan')) ? 'Jantan' : (birdData.tags && birdData.tags.includes('Betina')) ? 'Betina' : 'Unsexed' },
            { label: "Kondisi", value: "Sehat" },
            { label: "Status", value: birdData.status === 'sold' ? 'Terjual' : 'Tersedia' }
        ],
        images: birdData.image_url ? [birdData.image_url] : ["https://placehold.co/600x400?text=No+Image"],
        videos: birdData.videos && typeof birdData.videos === 'object' && !Array.isArray(birdData.videos) ? birdData.videos : {
            main: "",
            others: []
        },
        pedigree: birdData.pedigree || {
            f: "?",
            sire: { name: "Unknown", ring: "-", type: "-", img: "" },
            dam: { name: "Unknown", ring: "-", type: "-", img: "" }
        }
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200 mt-2">
                <div className="container mx-auto px-4 md:px-6 py-3">
                    <div className="flex items-center text-xs md:text-sm text-gray-500">
                        <Link href="/" className="hover:text-emerald-800 transition">Beranda</Link>
                        <ChevronRight className="w-3 h-3 md:w-4 md:h-4 mx-2" />
                        <Link href="/collection" className="hover:text-emerald-800 transition">Koleksi</Link>
                        <ChevronRight className="w-3 h-3 md:w-4 md:h-4 mx-2" />
                        <span className="text-emerald-900 font-semibold truncate">{bird.title}</span>
                    </div>
                </div>
            </div>

            <BirdDetail bird={bird} />
        </div>
    )
}
