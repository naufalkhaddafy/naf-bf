import Link from "next/link"
import { ChevronRight, ArrowLeft } from "lucide-react"
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

    // --- DATA MAPPING LOGIC ---

    // 1. Linked Birds
    // Extract the birds associated with this post
    const linkedBirds = (birdData.birds || []).map((b: any) => b.bird).filter(Boolean)
    const mainBird = linkedBirds[0] || birdData // Fallback to post data if no linked bird (shouldn't happen for valid posts)

    // 2. Images
    // Combine Post Main Image + All Bird Images
    let allImages = (birdData.image_url && birdData.image_url.trim() !== "") ? [birdData.image_url] : []
    linkedBirds.forEach((b: any) => {
        if (Array.isArray(b.images)) {
             // b.images is ["url1", "url2"]
            allImages = [...allImages, ...b.images]
        }
    })
    // Deduplicate and filter
    allImages = Array.from(new Set(allImages.filter((img: any) => typeof img === 'string' && img.trim() !== "")))
    if (allImages.length === 0) allImages = ["https://placehold.co/600x400?text=No+Image"]

    // 3. Videos
    // DB 'videos' column is typically { urls: ["..."] } from BirdForm
    const rawVideos = mainBird.videos || birdData.videos || { urls: [] }
    const videoUrls = Array.isArray(rawVideos.urls) ? rawVideos.urls : (Array.isArray(rawVideos) ? rawVideos : [])
    
    // Map to UI Structure { main: string, others: { title, duration, thumb }[] }
    // Map to UI Structure { main: string, others: { title, duration, thumb, url }[] }
    const mainVidUrl = videoUrls[0] || ""
    const mainVidId = getYouTubeID(mainVidUrl)

    const cleanedVideos = {
        main: mainVidId ? `https://www.youtube.com/embed/${mainVidId}` : mainVidUrl, 
        others: videoUrls.slice(1).map((url: string, idx: number) => {
            const vidId = getYouTubeID(url)
            return {
                title: `Video Pantauan ${idx + 2}`,
                duration: "Termonitor",
                thumb: vidId ? `https://img.youtube.com/vi/${vidId}/hqdefault.jpg` : "https://placehold.co/120x90?text=No+Thumb",
                url: url,
                embedUrl: vidId ? `https://www.youtube.com/embed/${vidId}` : url
            }
        })
    }

    // 4. Specs Groups Logic
    // We want to generate a list of specs for EACH bird.
    // If linkedBirds is populated, use that. Otherwise use mainBird (single).
    const birdsToMap = linkedBirds.length > 0 ? linkedBirds : [mainBird]
    
    const specsGroups = birdsToMap.map((b: any) => {
        // Parse existing specs from DB (JSON or Object)
        let dbSpecs = []
        try {
            if (typeof b.specs === 'string') {
                dbSpecs = JSON.parse(b.specs)
            } else if (Array.isArray(b.specs)) {
                dbSpecs = b.specs
            }
        } catch (e) { dbSpecs = [] }

        // Mandatory Specs: Ring, Sexing, Hatas (BoD)
        
        // Age Calculation Logic
        let hatasValue = "-"
        if (b.birth_date) {
            const birthDate = new Date(b.birth_date)
            const today = new Date()
            
            // Format Date: 10 Jan 2023
            const dateStr = birthDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            
            // Calculate Age
            const diffTime = Math.abs(today.getTime() - birthDate.getTime())
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) 
            const diffMonths = Math.floor(diffDays / 30.44) // Approx days per month
            const diffYears = Math.floor(diffDays / 365.25)

            let ageStr = ""
            if (diffYears >= 1) {
                ageStr = `(± ${diffYears} Tahun)`
            } else {
                ageStr = `(± ${diffMonths} Bulan)`
            }

            hatasValue = `${dateStr} ${ageStr}`
        }

        const mandatorySpecs = [
            { label: "Ring", value: b.code || "-" },
            { label: "Sexing", value: b.gender === 'male' ? 'Jantan' : b.gender === 'female' ? 'Betina' : 'Unsexed' },
            { label: "Date of Birth", value: hatasValue }
        ]

        // Merge (Mandatory first, then DB specs)
        // Filter out empty DB specs just in case
        const mergedSpecs = [
            ...mandatorySpecs,
            ...(dbSpecs || []).filter((s:any) => s.label && s.value)
        ]

        return {
            title: b.gender === 'male' ? 'Jantan' : b.gender === 'female' ? 'Betina' : 'Burung', // Title for the tab
            specs: mergedSpecs
        }
    })

    
    // 5. Pedigree
    // DB 'pedigree' column is { ayah: "Name", ibu: "Name" }
    const rawPedigree = mainBird.pedigree || birdData.pedigree || { ayah: "", ibu: "" }
    
    const finalPedigree = {
        f: "?", // Generation not explicitly stored in simple form yet
        sire: { 
            name: rawPedigree.ayah || "Unknown", 
            ring: "-", 
            type: "Murai Batu", 
            img: "https://placehold.co/100x100?text=Sire" 
        },
        dam: { 
            name: rawPedigree.ibu || "Unknown", 
            ring: "-", 
            type: "Murai Batu", 
            img: "https://placehold.co/100x100?text=Dam" 
        },
        // Placeholders for grandparents as simple form doesn't support them
        grandsire_s: "-",
        granddam_s: "-",
        grandsire_d: "-",
        granddam_d: "-"
    }

    // 6. Content Description
    // Clean up YouTube links from text
    let processedContent = birdData.content || birdData.description || (mainBird.description) || "Belum ada deskripsi detail."
    const youtubeRegex = /(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]+)/g
    const youtubeLinksInText = processedContent.match(youtubeRegex)

    if (youtubeLinksInText && youtubeLinksInText.length >= 2) {
        processedContent = processedContent.replace(youtubeRegex, "").trim()
        processedContent += "\n\n" + youtubeLinksInText.join("\n")
    }

    // Gender Label Logic
    let genderLabel = "Unsexed"
    if (birdData.type === 'pair' || linkedBirds.length > 1) {
        genderLabel = "Sepasang"
    } else if (mainBird.gender === 'male') {
        genderLabel = "Jantan"
    } else if (mainBird.gender === 'female') {
        genderLabel = "Betina"
    }

    // Category Label Logic (from tags)
    // Values derived from PostForm.tsx TAG_OPTIONS
    const tags = Array.isArray(birdData.tags) ? birdData.tags : []
    let categoryLabel = "Cucak Rowo" // Default

    if (tags.includes('trotolan')) categoryLabel = "Trotolan"
    else if (tags.includes('dewasa')) categoryLabel = "Siapan"
    else if (tags.includes('indukan_produk')) categoryLabel = "Indukan"

    // Date Logic
    const dateObj = new Date(birdData.updated_at || birdData.created_at)
    const dateLabel = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

    // Final UI Object
    const bird = {
        id: birdData.id,
        title: birdData.title,
        code: linkedBirds.length > 0 ? linkedBirds.map((b: any) => b.code).join(" & ") : (birdData.code || "NAF-XXX"),
        price: birdData.price ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(birdData.price) : "Hubungi Kami",
        originalPrice: undefined,
        rating: 5.0,
        description: processedContent,
        specsGroups: specsGroups,
        images: allImages,
        videos: cleanedVideos,
        pedigree: finalPedigree,    
        genderLabel: genderLabel,
        categoryLabel: categoryLabel,
        dateLabel: dateLabel
    }

    return (
        <div className="bg-gray-50 min-h-screen pt-24">
            <div className="container mx-auto px-4 md:px-6 mb-4">
                {/* Breadcrumb */}
                <div className="flex items-center text-xs md:text-sm text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-100 inline-flex shadow-sm">
                        <Link href="/" className="hover:text-emerald-800 transition">Beranda</Link>
                        <ChevronRight className="w-3 h-3 md:w-4 md:h-4 mx-2 text-gray-300" />
                        <Link href="/collection" className="hover:text-emerald-800 transition">Koleksi</Link>
                        <ChevronRight className="w-3 h-3 md:w-4 md:h-4 mx-2 text-gray-300" />
                        <span className="text-emerald-900 font-semibold truncate max-w-[150px] md:max-w-xs">{bird.title}</span>
                </div>
            </div>

            <BirdDetail bird={bird} />
        </div>
    )
}

function getYouTubeID(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}
