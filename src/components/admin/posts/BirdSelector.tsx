"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Check, Bird, X } from "lucide-react"
import { getAvailableBirdsForPost, getBirds } from "@/actions/birds"
import { Badge } from "@/components/ui/badge"

interface BirdSelectorProps {
    selectedBirdIds: string[]
    onChange: (ids: string[]) => void
    initialBirds?: any[] // For edit mode - pre-populate selected birds data
}

export function BirdSelector({ selectedBirdIds, onChange, initialBirds = [] }: BirdSelectorProps) {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const [birds, setBirds] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    
    // Store full bird objects for display of selected items
    const [selectedBirdsData, setSelectedBirdsData] = useState<any[]>(initialBirds)

    // Fetch birds when dialog opens or query changes
    useEffect(() => {
        if (open) {
            fetchBirds()
        }
    }, [open, query])

    // Load selected birds details on mount (if ids exist)
    useEffect(() => {
        if (selectedBirdIds.length > 0 && selectedBirdsData.length === 0) {
            // Initial fetch to get details of pre-selected birds
            getBirds().then(result => {
                const selected = result.birds?.filter((b: any) => selectedBirdIds.includes(b.id)) || []
                setSelectedBirdsData(selected)
            })
        }
    }, [selectedBirdIds])

    const fetchBirds = async () => {
        setLoading(true)
        const res = await getAvailableBirdsForPost({ query })
        setBirds(res || [])
        setLoading(false)
    }

    const toggleBird = (bird: any) => {
        if (selectedBirdIds.includes(bird.id)) {
            // Remove
            onChange(selectedBirdIds.filter(id => id !== bird.id))
            setSelectedBirdsData(prev => prev.filter(b => b.id !== bird.id))
        } else {
            // Add - with pair validation
            // If already have 1 bird selected, the next one must be opposite gender
            if (selectedBirdsData.length === 1) {
                const existingBird = selectedBirdsData[0]
                // Check if genders are opposite
                if (existingBird.gender === bird.gender) {
                    // Same gender - reject with warning
                    alert(`Tidak bisa memilih burung dengan jenis kelamin yang sama. Pilih pasangan ${existingBird.gender === 'male' ? 'betina (female)' : 'jantan (male)'}.`)
                    return
                }
            }
            
            // Limit to max 2 birds (pair)
            if (selectedBirdsData.length >= 2) {
                alert('Maksimal 2 burung per post (sepasang).')
                return
            }
            
            onChange([...selectedBirdIds, bird.id])
            setSelectedBirdsData(prev => [...prev, bird])
        }
    }

    return (
        <div className="space-y-4">
            {/* Selected Birds Display */}
            <div className="grid grid-cols-1 gap-3">
                {selectedBirdsData.map(bird => (
                     <div key={bird.id} className="flex items-center gap-3 p-3 bg-white border border-emerald-100 rounded-xl shadow-sm relative group">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                            {bird.images && bird.images[0] ? (
                                <img src={bird.images[0]} alt={bird.code} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <Bird className="w-6 h-6" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-sm">{bird.species}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 border-emerald-200 text-emerald-700 bg-emerald-50">
                                    {bird.code}
                                </Badge>
                                <span className="text-xs text-gray-500 capitalize">{bird.gender}</span>
                            </div>
                        </div>
                        <Button 
                            type="button" 
                            size="icon" 
                            variant="ghost" 
                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                            onClick={() => toggleBird(bird)}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                     </div>
                ))}
                
                {selectedBirdsData.length === 0 && (
                    <div className="text-sm text-gray-500 italic p-3 border border-dashed rounded-xl text-center bg-gray-50">
                        Belum ada burung yang dipilih.
                    </div>
                )}
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button type="button" variant="outline" className="w-full border-dashed border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400">
                        <Plus className="w-4 h-4 mr-2" /> Pilih Burung dari Inventaris
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-white">
                    <DialogHeader>
                        <DialogTitle>Pilih Burung</DialogTitle>
                    </DialogHeader>
                    
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input 
                            placeholder="Cari Code Ring / Spesies..." 
                            className="pl-9 bg-gray-50 border-gray-200"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>

                    <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
                        {loading ? (
                            <div className="text-center py-8 text-gray-500 text-sm">Loading...</div>
                        ) : birds.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 text-sm">Tidak ada data ditemukan.</div>
                        ) : (
                            birds.map(bird => {
                                const isSelected = selectedBirdIds.includes(bird.id)
                                return (
                                    <div 
                                        key={bird.id} 
                                        onClick={() => toggleBird(bird)}
                                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${isSelected ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-gray-100 hover:border-emerald-200 hover:bg-gray-50'}`}
                                    >
                                        <div className="w-10 h-10 bg-gray-200 rounded-md overflow-hidden shrink-0">
                                            {bird.images && bird.images[0] ? (
                                                <img src={bird.images[0]} alt={bird.code} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <Bird className="w-5 h-5" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-sm text-gray-900">{bird.species}</h4>
                                                {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                                            </div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-medium">{bird.code}</span>
                                                <span className="text-xs text-gray-500 capitalize">{bird.gender}</span>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full capitalize ${bird.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {bird.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                    
                    <DialogFooter>
                        <Button onClick={() => setOpen(false)} className="w-full bg-emerald-800 hover:bg-emerald-900 text-white">
                            Selesai Memilih
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
