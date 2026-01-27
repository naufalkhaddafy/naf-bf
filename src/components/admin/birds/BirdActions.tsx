"use client"

import { useState } from "react"
import { deleteBird } from "@/actions/birds"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash, Edit, Link as LinkIcon, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface BirdActionsProps {
    bird: any
}

export function BirdActions({ bird }: BirdActionsProps) {
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const handleDelete = async () => {
        setLoading(true)
        setShowDeleteDialog(false) 
        const toastId = toast.loading("Menghapus data...")

        try {
            const result = await deleteBird(bird.id)
            
            if (result.error) {
                toast.error("Gagal menghapus: " + result.error, { id: toastId })
            } else {
                toast.success("Data berhasil dihapus", { id: toastId })
            }
        } catch (error) {
            toast.error("Terjadi kesalahan saat menghapus", { id: toastId })
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white" disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin text-gray-500" /> : <MoreHorizontal className="w-4 h-4 text-gray-700" />}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl bg-white shadow-xl border border-gray-100 p-2 min-w-[160px]">
                    <DropdownMenuLabel className="text-xs text-gray-500 font-normal uppercase tracking-wider px-2 py-1.5">Actions</DropdownMenuLabel>
                    
                    <DropdownMenuItem className="rounded-lg hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer focus:bg-emerald-50 focus:text-emerald-700 gap-2">
                        <LinkIcon className="w-4 h-4" />
                        Link ke Postingan
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild className="rounded-lg hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer focus:bg-emerald-50 focus:text-emerald-700 gap-2">
                        <Link href={`/admin/birds/${bird.id}/edit`}>
                            <Edit className="w-4 h-4" />
                            Edit Data
                        </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator className="my-1 bg-gray-100" />
                    
                    <DropdownMenuItem 
                        onSelect={(e) => {
                            e.preventDefault()
                            setIsOpen(false)
                            setShowDeleteDialog(true)
                        }}
                        className="rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 cursor-pointer focus:bg-red-50 focus:text-red-700 gap-2"
                    >
                        <Trash className="w-4 h-4" />
                        Hapus Data
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Data Burung?</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus data burung <strong>{bird.code}</strong> ({bird.species})? 
                            Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white border-none">
                            {loading ? "Menghapus..." : "Ya, Hapus"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
