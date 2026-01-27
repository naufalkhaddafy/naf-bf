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
        .select(`
            *,
            birds:post_birds(
                bird:birds(*)
            )
        `)
        .eq('slug', slug)
        .single()

    if (error || !birdData) {
        notFound()
    }

    // Helper to extract birds from junction
    const linkedBirds = (birdData.birds || []).map((b: any) => b.bird).filter(Boolean)

    // Image logic: Combine post main image with all images from linked birds
    let allImages = (birdData.image_url && birdData.image_url.trim() !== "") ? [birdData.image_url] : []
    linkedBirds.forEach((b: any) => {
        if (Array.isArray(b.images)) {
            allImages = [...allImages, ...b.images]
        }
    })
    // Deduplicate and filter out empty strings/nulls
    allImages = Array.from(new Set(allImages.filter((img: any) => typeof img === 'string' && img.trim() !== "")))
    if (allImages.length === 0) allImages = ["https://placehold.co/600x400?text=No+Image"]

    // Content logic: Move multiple YouTube links to the end
    let processedContent = birdData.content || birdData.description || "Belum ada deskripsi detail."
    const youtubeRegex = /(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]+)/g
    const youtubeLinks = processedContent.match(youtubeRegex)

    if (youtubeLinks && youtubeLinks.length >= 2) {
        // Remove links from original content
        processedContent = processedContent.replace(youtubeRegex, "").trim()
        // Add links to the end
        processedContent += "\n\n" + youtubeLinks.join("\n")
    }

    // Specs Logic: Combine specs if multiple birds
    let finalSpecs = birdData.specs
    if (!finalSpecs || (Array.isArray(finalSpecs) && finalSpecs.length === 0)) {
        if (linkedBirds.length > 0) {
            finalSpecs = linkedBirds.flatMap((b: any) => {
                const prefix = linkedBirds.length > 1 ? `[${b.code}] ` : ""
                const birdSpecs = Array.isArray(b.specs) ? b.specs : []
                return birdSpecs.map((s: any) => ({
                    label: `${prefix}${s.label}`,
                    value: s.value
                }))
            })
        }
    }

    // Fallback specs if still empty
    if (!finalSpecs || (Array.isArray(finalSpecs) && finalSpecs.length === 0)) {
        finalSpecs = [
            { label: "Kode Ring", value: birdData.code || "NAF-XXX" },
            { label: "Jenis Kelamin", value: (birdData.tags && birdData.tags.includes('Jantan')) ? 'Jantan' : (birdData.tags && birdData.tags.includes('Betina')) ? 'Betina' : 'Unsexed' },
            { label: "Kondisi", value: "Sehat" },
            { label: "Status", value: birdData.status === 'sold' ? 'Terjual' : 'Tersedia' }
        ]
    }

    // Pedigree Logic: If multiple birds, we might need a way to show both in the future, 
    // but for now let's take the first one or the post's own pedigree
    const finalPedigree = birdData.pedigree || (linkedBirds[0]?.pedigree) || {
        f: "?",
        sire: { name: "Unknown", ring: "-", type: "-", img: "" },
        dam: { name: "Unknown", ring: "-", type: "-", img: "" }
    }

    // Video cleanup: ensure no empty thumbnails
    const rawVideos = birdData.videos && typeof birdData.videos === 'object' && !Array.isArray(birdData.videos) ? birdData.videos : { main: "", others: [] }
    const cleanedVideos = {
        main: rawVideos.main || "",
        others: Array.isArray(rawVideos.others) 
            ? rawVideos.others.map((v: any) => ({
                ...v,
                thumb: (v.thumb && v.thumb.trim() !== "") ? v.thumb : "https://placehold.co/600x400?text=No+Video"
            }))
            : []
    }

    // Map DB data to UI format
    const bird = {
        id: birdData.id,
        title: birdData.title,
        code: birdData.code || (linkedBirds.length > 0 ? linkedBirds.map((b: any) => b.code).join(" & ") : "NAF-XXX"),
        price: birdData.price ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(birdData.price) : "Hubungi Kami",
        originalPrice: undefined,
        rating: 5.0,
        description: processedContent,
        specs: finalSpecs,
        images: allImages,
        videos: cleanedVideos,
        pedigree: finalPedigree
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
