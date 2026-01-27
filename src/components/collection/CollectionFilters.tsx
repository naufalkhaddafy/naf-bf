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

interface CollectionFiltersProps {
    onApply?: () => void
    hideSearch?: boolean
}

export function CollectionFilters({ onApply, hideSearch }: CollectionFiltersProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    
    // Initialize state from URL params
    const [categories, setCategories] = useState<string[]>(searchParams.get('category')?.split(',').filter(Boolean) || [])
    const [types, setTypes] = useState<string[]>(searchParams.get('type')?.split(',').filter(Boolean) || [])
    const [prices, setPrices] = useState<string[]>(searchParams.get('price')?.split(',').filter(Boolean) || [])
    const [search, setSearch] = useState(searchParams.get('q') || '')
    
    // Sync state with URL params when they change (e.g., reset from outside or navigation)
    useEffect(() => {
        setCategories(searchParams.get('category')?.split(',').filter(Boolean) || [])
        setTypes(searchParams.get('type')?.split(',').filter(Boolean) || [])
        setPrices(searchParams.get('price')?.split(',').filter(Boolean) || [])
        setSearch(searchParams.get('q') || '')
    }, [searchParams])

    // Check if any filters are set in LOCAL state
    const hasActiveFilters = categories.length > 0 || types.length > 0 || prices.length > 0 || search !== ''
    
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
    
    // Toggle a filter value (Local State Only)
    const toggleFilter = (
        currentValues: string[], 
        setValues: React.Dispatch<React.SetStateAction<string[]>>, 
        value: string
    ) => {
        if (currentValues.includes(value)) {
            setValues(currentValues.filter(v => v !== value))
        } else {
            setValues([...currentValues, value])
        }
    }

    // Apply Filters to URL
    const applyFilters = () => {
        const queryString = createQueryString({
            category: categories.length > 0 ? categories.join(',') : null,
            type: types.length > 0 ? types.join(',') : null,
            price: prices.length > 0 ? prices.join(',') : null,
            q: search || null
        })
        
        router.push(pathname + (queryString ? `?${queryString}` : ''))
        
        if (onApply) {
            onApply()
        }
    }
    
    // Handle search submit (Enter key)
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        applyFilters()
    }
    
    // Reset all filters
    const resetFilters = () => {
        setCategories([])
        setTypes([])
        setPrices([])
        setSearch('')
        
        // Immediately push empty params to URL
        router.push(pathname)
        
        if (onApply) {
            onApply()
        }
    }
    
    return (
        <div className="bg-white p-6 rounded-2xl lg:shadow-lg lg:border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6 shrink-0">
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

            <div className="flex-1 overflow-y-auto min-h-0 pr-2 -mr-2 space-y-6">
                {/* Search - Conditionally Rendered */}
                {!hideSearch && (
                    <form onSubmit={handleSearch} className="relative">
                        <Input 
                            type="text" 
                            placeholder="Cari burung (Tekan Enter)..." 
                            className="bg-gray-50 rounded-xl pr-10" 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="button" onClick={applyFilters} className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Search className="w-4 h-4 text-gray-400 hover:text-emerald-600 transition" />
                        </button>
                    </form>
                )}

                {/* Filter by Category */}
                <div className="border-b border-gray-100 pb-6">
                    <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Kategori</h4>
                    <div className="space-y-3">
                        {CATEGORY_OPTIONS.map((option) => (
                            <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-1 focus:ring-emerald-500 focus:ring-offset-0 hover:border-emerald-500 transition-all" 
                                    checked={categories.includes(option.value)}
                                    onChange={() => toggleFilter(categories, setCategories, option.value)}
                                />
                                <span className="text-sm text-gray-600 group-hover:text-emerald-700 transition">{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Filter by Type */}
                <div className="border-b border-gray-100 pb-6">
                    <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Tipe</h4>
                    <div className="space-y-3">
                        {TYPE_OPTIONS.map((option) => (
                            <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-1 focus:ring-emerald-500 focus:ring-offset-0 hover:border-emerald-500 transition-all" 
                                    checked={types.includes(option.value)}
                                    onChange={() => toggleFilter(types, setTypes, option.value)}
                                />
                                <span className="text-sm text-gray-600 group-hover:text-emerald-700 transition">{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Filter by Price Range */}
                <div className="pb-6">
                    <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Rentang Harga</h4>
                    <div className="space-y-3">
                        {PRICE_OPTIONS.map((option) => (
                            <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-1 focus:ring-emerald-500 focus:ring-offset-0 hover:border-emerald-500 transition-all" 
                                    checked={prices.includes(option.value)}
                                    onChange={() => toggleFilter(prices, setPrices, option.value)}
                                />
                                <span className="text-sm text-gray-600 group-hover:text-emerald-700 transition">{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-6 pt-4 border-t border-gray-100 shrink-0">
                <Button 
                    onClick={applyFilters} 
                    className="w-full text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl py-2 font-bold text-md shadow-emerald-900/10 shadow-lg"
                >
                    Terapkan Filter {hasActiveFilters ? `(${[...categories, ...types, ...prices].length + (search ? 1 : 0)})` : ''}
                </Button>
            </div>
        </div>
    )
}
