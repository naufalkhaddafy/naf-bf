"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useCallback, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetDescription, SheetClose } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X, Calendar } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export function BirdFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State for filters
  const [query, setQuery] = useState(searchParams.get("query") || "")
  const [gender, setGender] = useState(searchParams.get("gender") || "all")
  const [status, setStatus] = useState(searchParams.get("status") || "all")
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || "")
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "")
  
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
         gender !== "all" || 
         status !== "all" || 
         startDate !== "" || 
         endDate !== "" ||
         !!query
     )
  }, [gender, status, startDate, endDate, query])

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
      gender,
      status,
      startDate,
      endDate
    })
    setIsOpen(false)
  }

  const resetFilters = () => {
    setGender("all")
    setStatus("all")
    setStartDate("")
    setEndDate("")
    setQuery("")
    
    // Clear URL
    router.push("?")
    setIsOpen(false)
  }

  // Count active filters for badge
  const activeCount = [
      gender !== "all",
      status !== "all",
      startDate !== "",
      endDate !== ""
  ].filter(Boolean).length

  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input 
          className="pl-10 h-10 bg-gray-50 border-none focus-visible:ring-emerald-500" 
          placeholder="Cari Code Ring atau Spesies..." 
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
            <Button variant={activeCount > 0 ? "default" : "outline"} className={`gap-2 rounded-full ${activeCount > 0 ? 'bg-emerald-800 text-white hover:bg-emerald-900 border-none' : 'border-gray-200 text-gray-700'}`}>
                <Filter className="w-4 h-4" /> 
                Filter
                {activeCount > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30">
                        {activeCount}
                    </Badge>
                )}
            </Button>
        </SheetTrigger>
        <SheetContent className="overflow-y-auto">
            <SheetHeader>
                <SheetTitle>Filter Data Burung</SheetTitle>
                <SheetDescription>
                    Tampilkan data spesifik berdasarkan kriteria.
                </SheetDescription>
            </SheetHeader>

            <div className="grid gap-6 py-6">
                {/* Gender Filter */}
                <div className="space-y-2">
                    <Label>Jenis Kelamin (Sexing)</Label>
                    <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger>
                            <SelectValue placeholder="Semua Gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua</SelectItem>
                            <SelectItem value="male">Jantan (Male)</SelectItem>
                            <SelectItem value="female">Betina (Female)</SelectItem>
                            <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                    <Label>Status Burung</Label>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                            <SelectValue placeholder="Semua Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="available">Available (Tersedia)</SelectItem>
                            <SelectItem value="booked">Booked (Dibooking)</SelectItem>
                            <SelectItem value="sold">Sold (Terjual)</SelectItem>
                            <SelectItem value="deceased">Deceased (Mati)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Date Range Filter */}
                <div className="space-y-4">
                    <Label>Tanggal Lahir</Label>
                    <div className="grid gap-2">
                        <div className="grid grid-cols-[3fr_1fr] items-center gap-2">
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <Input 
                                    type="date" 
                                    className="pl-9"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <span className="text-xs text-gray-500 text-center">Dari</span>
                        </div>
                        <div className="grid grid-cols-[3fr_1fr] items-center gap-2">
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <Input 
                                    type="date" 
                                    className="pl-9"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                            <span className="text-xs text-gray-500 text-center">Sampai</span>
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
