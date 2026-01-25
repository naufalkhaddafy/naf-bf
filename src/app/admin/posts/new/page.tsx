"use client" // Client component for form handling state if complicated, or server component with form action? Using form action.
// Actually, simple form definition here.
import { createPost } from "@/actions/posts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

export default function NewPostPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-serif font-bold text-emerald-900">Tambah Koleksi Baru</h1>
            
            <Card>
                <CardContent className="pt-6">
                    <form action={createPost} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Judul / Nama Burung</Label>
                            <Input name="title" id="title" placeholder="Contoh: Cucak Rowo Ring 105" required />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="slug">Slug (Optional)</Label>
                                <Input name="slug" id="slug" placeholder="cucak-rowo-ring-105" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Harga (Angka)</Label>
                                <Input name="price" id="price" type="number" placeholder="12500000" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi Singkat</Label>
                            <Textarea name="description" id="description" placeholder="Deskripsi kondisi burung..." rows={4} />
                        </div>

                        {/* More fields (images, attributes) would go here, requiring client-side JS/Supabase Storage upload logic */}
                        
                        <div className="pt-4">
                            <Button type="submit" className="bg-emerald-800 hover:bg-emerald-900">Simpan Koleksi</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
