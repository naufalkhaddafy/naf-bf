"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useCallback, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetDescription } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X, Calendar, DollarSign } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export function PostFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State for filters
  const [query, setQuery] = useState(searchParams.get("query") || "")
  const [status, setStatus] = useState(searchParams.get("status") || "all")
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || "")
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "")
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "")
  
  const [isOpen, setIsOpen] = useState(false)
  const [hasActiveFilters, setHasActiveFilters] = useState(false)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== (searchParams.get("query") || "")) {
        updateParams({ query: query || null })
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [query])

  // Check active filters
  useEffect(() => {
     setHasActiveFilters(
         status !== "all" || 
         startDate !== "" || 
         endDate !== "" ||
         minPrice !== "" ||
         maxPrice !== "" ||
         !!query
     )
  }, [status, startDate, endDate, minPrice, maxPrice, query])

  const updateParams = useCallback((newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "" || value === "all") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    router.push(`?${params.toString()}`)
  }, [searchParams, router])

  const applyFilters = () => {
    updateParams({
      status,
      startDate,
      endDate,
      minPrice,
      maxPrice
    })
    setIsOpen(false)
  }

  const resetFilters = () => {
    setStatus("all")
    setStartDate("")
    setEndDate("")
    setMinPrice("")
    setMaxPrice("")
    setQuery("")
    
    // Clear URL
    router.push("?")
    setIsOpen(false)
  }

  // Count active filters for badge
  const activeCount = [
      status !== "all",
      startDate !== "",
      endDate !== "",
      minPrice !== "",
      maxPrice !== ""
  ].filter(Boolean).length

  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input 
          className="pl-10 h-11 bg-gray-50 border-none focus-visible:ring-emerald-500 rounded-xl" 
          placeholder="Cari judul post..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
            <button 
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
                <X className="w-4 h-4" />
            </button>
        )}
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
            <Button variant={activeCount > 0 ? "default" : "outline"} className={`gap-2 rounded-full h-11 ${activeCount > 0 ? 'bg-emerald-800 text-white hover:bg-emerald-900 border-none' : 'border-gray-200 text-gray-700'}`}>
                <Filter className="w-4 h-4" /> 
                Filter
                {activeCount > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30">
                        {activeCount}
                    </Badge>
                )}
            </Button>
        </SheetTrigger>
        <SheetContent className="overflow-y-auto bg-white">
            <SheetHeader>
                <SheetTitle>Filter Posts</SheetTitle>
                <SheetDescription>
                    Tampilkan posts sesuai kriteria tertentu.
                </SheetDescription>
            </SheetHeader>

            <div className="grid gap-6 py-6">
                {/* Status Filter */}
                <div className="space-y-2">
                    <Label>Status Post</Label>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                            <SelectValue placeholder="Semua Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="available">Available (Tersedia)</SelectItem>
                            <SelectItem value="booked">Booked (Dibooking)</SelectItem>
                            <SelectItem value="sold">Sold (Terjual)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Date Range Filter */}
                <div className="space-y-4">
                    <Label>Tanggal Postingan</Label>
                    <div className="grid gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 w-14 shrink-0">Dari</span>
                            <div className="relative flex-1">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <Input 
                                    type="date" 
                                    className="pl-9"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 w-14 shrink-0">Sampai</span>
                            <div className="relative flex-1">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <Input 
                                    type="date" 
                                    className="pl-9"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-4">
                    <Label>Range Harga</Label>
                    <div className="grid gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 w-14 shrink-0">Min</span>
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium">Rp</span>
                                <Input 
                                    type="number" 
                                    className="pl-9"
                                    placeholder="0"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 w-14 shrink-0">Max</span>
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium">Rp</span>
                                <Input 
                                    type="number" 
                                    className="pl-9"
                                    placeholder="10.000.000"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <SheetFooter className="flex-col sm:flex-col gap-3 mt-6">
                <Button onClick={applyFilters} className="w-full bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white shadow-lg shadow-emerald-900/20 rounded-full h-11">
                    Terapkan Filter
                </Button>
                {hasActiveFilters && (
                    <Button variant="ghost" onClick={resetFilters} className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full">
                        Reset Filter
                    </Button>
                )}
            </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
