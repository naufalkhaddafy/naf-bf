"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { updatePost } from "@/actions/posts"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, LayoutGrid, Tag } from "lucide-react"
import { toast } from "sonner"
import { BirdSelector } from "./BirdSelector"

const formSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  price: z.number().min(0, "Harga tidak valid"),
  status: z.string(),
  tags: z.array(z.string()),
  description: z.string().optional(),
  selectedBirdIds: z.array(z.string()).min(1, "Pilih minimal 1 burung"),
})

const TAG_OPTIONS = [
  { value: "trotolan", label: "Trotolan (Anakan)" },
  { value: "dewasa", label: "Dewasa / Siapan" },
  { value: "indukan_produk", label: "Indukan Produk" },
]

interface PostEditFormProps {
  post: {
    id: string
    title: string
    content?: string
    price?: number
    status: string
    tags?: string[]
    post_birds?: { bird_id: string; birds: any }[]
  }
}

export function PostEditForm({ post }: PostEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Extract bird IDs from post_birds
  const initialBirdIds = post.post_birds?.map(pb => pb.bird_id) || []

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post.title || "",
      price: post.price || 0,
      status: post.status || "available",
      tags: post.tags || [],
      description: post.content || "",
      selectedBirdIds: initialBirdIds,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("title", values.title)
      formData.append("price", values.price.toString())
      formData.append("status", values.status)
      formData.append("tags", JSON.stringify(values.tags))
      formData.append("description", values.description || "")
      formData.append("selectedBirdIds", JSON.stringify(values.selectedBirdIds))

      const result = await updatePost(post.id, formData)

      if (result?.error) {
        toast.error("Gagal mengupdate: " + result.error)
        setLoading(false)
      } else if (result?.success) {
        toast.success("Post berhasil diupdate!")
        router.push("/admin/posts")
        router.refresh()
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem")
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Post Details */}
            <div className="md:col-span-2 space-y-6">
                
                {/* Section 1: Basic Info */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                            <LayoutGrid className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Informasi Post</h3>
                    </div>
                    
                    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <div className="space-y-2">
                            <Label>Judul Postingan</Label>
                            <Input {...form.register("title")} placeholder="Contoh: Super Pair Murai Batu (MB-01 + MB-02)" className="text-lg font-semibold" />
                            {form.formState.errors.title && <p className="text-red-500 text-xs">{form.formState.errors.title.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label>Harga (IDR)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-semibold">Rp</span>
                                    <Input type="number" {...form.register("price", { valueAsNumber: true })} className="pl-10" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select onValueChange={(val) => form.setValue("status", val)} defaultValue={form.getValues("status")}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="available">Available (Tersedia)</SelectItem>
                                        <SelectItem value="booked">Booked</SelectItem>
                                        <SelectItem value="sold">Sold (Terjual)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Tags Selection */}
                        <div className="space-y-2">
                            <Label>Kategori (Tags)</Label>
                            <div className="flex flex-wrap gap-2">
                                {TAG_OPTIONS.map((tag) => {
                                    const isSelected = form.watch("tags").includes(tag.value)
                                    return (
                                        <button
                                            key={tag.value}
                                            type="button"
                                            onClick={() => {
                                                const current = form.getValues("tags")
                                                if (isSelected) {
                                                    form.setValue("tags", current.filter(t => t !== tag.value))
                                                } else {
                                                    form.setValue("tags", [...current, tag.value])
                                                }
                                            }}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                                isSelected 
                                                    ? 'bg-emerald-600 text-white shadow-md' 
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            {tag.label}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Deskripsi Promosi</Label>
                            <Textarea 
                                {...form.register("description")} 
                                rows={5} 
                                placeholder="Tulis deskripsi yang menarik untuk pembeli..." 
                            />
                        </div>
                    </div>
                </section>
            </div>

            {/* Right Column: Bird Selection */}
            <div className="space-y-6">
                <section className="space-y-4">
                     <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                            <Tag className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Burung Terkait</h3>
                    </div>
                    
                    <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <BirdSelector 
                            selectedBirdIds={form.watch("selectedBirdIds")} 
                            onChange={(ids) => form.setValue("selectedBirdIds", ids)}
                            initialBirds={post.post_birds?.map(pb => pb.birds) || []}
                        />
                        {form.formState.errors.selectedBirdIds && (
                            <p className="text-red-500 text-xs mt-2">{form.formState.errors.selectedBirdIds.message}</p>
                        )}
                    </div>
                </section>
            </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-4">
            <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                className="rounded-full px-6"
            >
                Batal
            </Button>
            <Button 
                type="submit" 
                disabled={loading}
                className="bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white shadow-lg shadow-emerald-900/20 rounded-full px-8"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...
                    </>
                ) : (
                    'Simpan Perubahan'
                )}
            </Button>
        </div>
      </form>
    </div>
  )
}
