"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"

const SORT_OPTIONS = [
    { label: 'Terbaru', value: 'newest' },
    { label: 'Terlama', value: 'oldest' },
    { label: 'Harga Terendah', value: 'price_asc' },
    { label: 'Harga Tertinggi', value: 'price_desc' }
]

export function CollectionSort() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    
    const currentSort = searchParams.get('sort') || 'newest'
    
    const handleSort = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        
        if (value === 'newest') {
            params.delete('sort')
        } else {
            params.set('sort', value)
        }
        
        const queryString = params.toString()
        router.push(pathname + (queryString ? `?${queryString}` : ''), { scroll: false })
    }
    
    return (
        <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Urutkan:</span>
            <div className="relative">
                <select 
                    className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 pr-8 cursor-pointer"
                    value={currentSort}
                    onChange={(e) => handleSort(e.target.value)}
                >
                    {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="w-4 h-4" />
                </div>
            </div>
        </div>
    )
}
