"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SlidersHorizontal, Search, X } from "lucide-react"
import { useCallback, useState, useEffect } from "react"

const CATEGORY_OPTIONS = [
    { label: 'Trotolan (Anakan)', value: 'trotolan' },
    { label: 'Dewasa / Siapan', value: 'dewasa' },
    { label: 'Indukan Produk', value: 'indukan_produk' }
]

const TYPE_OPTIONS = [
    { label: 'Jantan (♂)', value: 'male' },
    { label: 'Betina (♀)', value: 'female' },
    { label: 'Sepasang (♂+♀)', value: 'pair' }
]

const PRICE_OPTIONS = [
    { label: '< 5 Juta', value: 'under5' },
    { label: '5 Juta - 10 Juta', value: '5to10' },
    { label: '> 10 Juta', value: 'over10' }
]

export function CollectionFilters() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    
    // Get current filter values from URL
    const currentCategories = searchParams.get('category')?.split(',').filter(Boolean) || []
    const currentTypes = searchParams.get('type')?.split(',').filter(Boolean) || []
    const currentPrices = searchParams.get('price')?.split(',').filter(Boolean) || []
    const currentSearch = searchParams.get('q') || ''
    
    const [search, setSearch] = useState(currentSearch)
    
    // Check if any filters are active
    const hasActiveFilters = currentCategories.length > 0 || currentTypes.length > 0 || currentPrices.length > 0 || currentSearch
    
    // Create new URL with updated params
    const createQueryString = useCallback((updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString())
        
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === '') {
                params.delete(key)
            } else {
                params.set(key, value)
            }
        })
        
        return params.toString()
    }, [searchParams])
    
    // Toggle a filter value
    const toggleFilter = (key: string, value: string) => {
        const currentValues = searchParams.get(key)?.split(',').filter(Boolean) || []
        let newValues: string[]
        
        if (currentValues.includes(value)) {
            newValues = currentValues.filter(v => v !== value)
        } else {
            newValues = [...currentValues, value]
        }
        
        const queryString = createQueryString({
            [key]: newValues.length > 0 ? newValues.join(',') : null
        })
        
        router.push(pathname + (queryString ? `?${queryString}` : ''))
    }
    
    // Handle search submit
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const queryString = createQueryString({ q: search || null })
        router.push(pathname + (queryString ? `?${queryString}` : ''))
    }
    
    // Reset all filters
    const resetFilters = () => {
        setSearch('')
        router.push(pathname)
    }
    
    return (
        <div className="bg-white p-6 rounded-2xl lg:shadow-lg lg:border border-gray-100 lg:sticky top-24">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-emerald-600" /> Filter
                </h3>
                {hasActiveFilters && (
                    <button 
                        onClick={resetFilters} 
                        className="text-xs text-red-500 hover:text-red-600 font-medium hover:underline transition flex items-center gap-1"
                    >
                        <X className="w-3 h-3" /> Reset
                    </button>
                )}
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="mb-6 relative">
                <Input 
                    type="text" 
                    placeholder="Cari burung..." 
                    className="bg-gray-50 rounded-xl pr-10" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Search className="w-4 h-4 text-gray-400 hover:text-emerald-600 transition" />
                </button>
            </form>

            {/* Filter by Category */}
            <div className="mb-6 border-b border-gray-100 pb-6">
                <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Kategori</h4>
                <div className="space-y-3">
                    {CATEGORY_OPTIONS.map((option) => (
                        <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300" 
                                checked={currentCategories.includes(option.value)}
                                onChange={() => toggleFilter('category', option.value)}
                            />
                            <span className="text-sm text-gray-600 group-hover:text-emerald-700 transition">{option.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Filter by Type */}
            <div className="mb-6 border-b border-gray-100 pb-6">
                <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Tipe</h4>
                <div className="space-y-3">
                    {TYPE_OPTIONS.map((option) => (
                        <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300" 
                                checked={currentTypes.includes(option.value)}
                                onChange={() => toggleFilter('type', option.value)}
                            />
                            <span className="text-sm text-gray-600 group-hover:text-emerald-700 transition">{option.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Filter by Price Range */}
            <div className="mb-6 border-b border-gray-100 pb-6">
                <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Rentang Harga</h4>
                <div className="space-y-3">
                    {PRICE_OPTIONS.map((option) => (
                        <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300" 
                                checked={currentPrices.includes(option.value)}
                                onChange={() => toggleFilter('price', option.value)}
                            />
                            <span className="text-sm text-gray-600 group-hover:text-emerald-700 transition">{option.label}</span>
                        </label>
                    ))}
                </div>
            </div>
            
            {/* Active Filters Summary */}
            {hasActiveFilters && (
                <div className="text-xs text-gray-500 text-center">
                    Filter aktif: {[...currentCategories, ...currentTypes, ...currentPrices].length + (currentSearch ? 1 : 0)}
                </div>
            )}
        </div>
    )
}
