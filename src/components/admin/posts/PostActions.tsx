"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { deletePost } from "@/actions/posts"
import { toast } from "sonner"

interface PostActionsProps {
    postId: string
    postTitle: string
}

export function PostActions({ postId, postTitle }: PostActionsProps) {
    const router = useRouter()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const result = await deletePost(postId)
            if (result?.error) {
                toast.error("Gagal menghapus: " + result.error)
            } else {
                toast.success("Post berhasil dihapus")
                router.refresh()
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem")
        } finally {
            setIsDeleting(false)
            setShowDeleteDialog(false)
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600 rounded-full">
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white">
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href={`/admin/posts/${postId}/edit`} className="flex items-center gap-2">
                            <Pencil className="w-4 h-4" /> Edit Post
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                    >
                        <Trash2 className="w-4 h-4 mr-2" /> Hapus Post
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="sm:max-w-md bg-white">
                    <DialogHeader>
                        <DialogTitle>Hapus Post?</DialogTitle>
                        <DialogDescription>
                            Anda yakin ingin menghapus post <strong>"{postTitle}"</strong>? Aksi ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-3 sm:gap-3">
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
                            Batal
                        </Button>
                        <Button 
                            onClick={handleDelete} 
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white border-none"
                        >
                            {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
