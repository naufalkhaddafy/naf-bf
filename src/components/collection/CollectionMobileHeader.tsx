"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, ChevronDown, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { CollectionFilters } from "./CollectionFilters"
import { CollectionSort } from "./CollectionSort"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

export function CollectionMobileHeader() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    
    const currentSearch = searchParams.get('q') || ''
    const [search, setSearch] = useState(currentSearch)
    const [isOpen, setIsOpen] = useState(false)

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const params = new URLSearchParams(searchParams.toString())
        if (search) {
            params.set('q', search)
        } else {
            params.delete('q')
        }
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="lg:hidden bg-white border-b border-gray-100 p-4 sticky top-16 z-30 shadow-sm space-y-3">
            {/* Search Row */}
            <form onSubmit={handleSearch} className="relative">
                <Input 
                    type="text" 
                    placeholder="Cari burung (Tekan Enter)..." 
                    className="bg-gray-50 rounded-xl pr-10 border-gray-100 focus:border-emerald-500 h-11" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-800 p-1.5 rounded-lg">
                    <Search className="w-4 h-4 text-white" />
                </button>
            </form>

            {/* Action Row */}
            <div className="flex items-center gap-2">
                <div className="flex-1">
                    <CollectionSort />
                </div>
                
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="rounded-xl border-gray-200 h-10 flex items-center gap-2 font-bold text-emerald-800">
                            <SlidersHorizontal className="w-4 h-4" />
                            Filter
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[85%] sm:w-[400px] p-0 border-l-0">
                        <SheetHeader className="p-6 border-b border-gray-100">
                            <SheetTitle className="text-left font-serif text-2xl text-emerald-900 flex items-center gap-2">
                                <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
                                Filter Koleksi
                            </SheetTitle>
                        </SheetHeader>
                        <div className="h-[calc(100vh-80px)] overflow-hidden">
                            {/* Pass onApply to close the sheet when user applies filter */}
                            <CollectionFilters onApply={() => setIsOpen(false)} hideSearch={true} />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}
