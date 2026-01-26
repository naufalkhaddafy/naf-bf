"use client"


import { useState } from "react"
import { useRouter } from "next/navigation"
import { createPost, updatePost } from "@/actions/posts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner" // Ensure sonner is installed/configured, or use a simple alert if not.

// Define types for our form state to manage the complex JSONs
type PostFormProps = {
    post?: any // In real app, define proper interface matching DB
    isEdit?: boolean
}

export function PostForm({ post, isEdit = false }: PostFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    // Form States
    const [specs, setSpecs] = useState(post?.specs || [
        { label: "Kode Ring", value: "" },
        { label: "Jenis Kelamin", value: "" },
        { label: "Kondisi Fisik", value: "" },
        { label: "Karakter Suara", value: "" },
        { label: "Pakan Utama", value: "" },
        { label: "Asal Indukan", value: "" },
    ])

    const [pedigree, setPedigree] = useState(post?.pedigree || {
        f: "F?",
        sire: { name: "", ring: "", type: "", img: "" },
        dam: { name: "", ring: "", type: "", img: "" },
    })
    
    const [videos, setVideos] = useState(post?.videos || {
        main: "", // Youtube ID
        others: []
    })

    const handleSpecChange = (index: number, field: 'label' | 'value', val: string) => {
        const newSpecs = [...specs]
        newSpecs[index][field] = val
        setSpecs(newSpecs)
    }

    const handlePedigreeChange = (parent: 'sire' | 'dam', field: string, val: string) => {
        setPedigree((prev: any) => ({
            ...prev,
            [parent]: { ...prev[parent], [field]: val }
        }))
    }


    async function handleSubmit(formData: FormData) {
        setLoading(true)
        
        // Append complex data as JSON strings
        formData.append("specs", JSON.stringify(specs))
        formData.append("pedigree", JSON.stringify(pedigree))
        formData.append("videos", JSON.stringify(videos))

        let result
        if (isEdit && post?.id) {
             result = await updatePost(post.id, null, formData)
        } else {
             result = await createPost(formData)
        }
        
        setLoading(false)

        if (result?.error) {
            alert(result.error) // Basic error handling
        } else {
            // alert("Berhasil!")
            // Redirect handled in action, but we can double check
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Main Info Column */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Judul / Nama Burung</Label>
                                <Input name="title" id="title" defaultValue={post?.title} placeholder="Contoh: Cucak Rowo Ring 105" required />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="code">Kode Ring / ID</Label>
                                    <Input name="code" id="code" defaultValue={post?.code} placeholder="NAF-105" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price">Harga (Rp)</Label>
                                    <Input name="price" id="price" type="number" defaultValue={post?.price} placeholder="12500000" />
                                </div>
                            </div>
                            
                             <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select name="status" defaultValue={post?.status || "available"}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="available">Tersedia</SelectItem>
                                        <SelectItem value="sold">Terjual</SelectItem>
                                        <SelectItem value="booked">Booked</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi Lengkap</Label>
                                <Textarea name="description" id="description" defaultValue={post?.description || post?.content} placeholder="Deskripsi kondisi burung, mental, dan kelebihan..." rows={6} />
                            </div>
                            
                             <div className="space-y-2">
                                <Label htmlFor="image_url">Link Foto Utama (URL)</Label>
                                <Input name="image_url" id="image_url" defaultValue={post?.image_url} placeholder="https://..." />
                                <p className="text-xs text-gray-500">Sementara gunakan link eksternal (Unsplash/Imgur) sampai fitur upload dibuat.</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Details Tabs */}
                    <Tabs defaultValue="specs">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="specs">Spesifikasi</TabsTrigger>
                            <TabsTrigger value="pedigree">Silsilah (Pedigree)</TabsTrigger>
                            <TabsTrigger value="media">Video & Media</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="specs">
                            <Card>
                                <CardContent className="pt-6 space-y-4">
                                    {specs.map((spec: any, index: number) => (
                                        <div key={index} className="grid grid-cols-3 gap-2 items-center">
                                            <Input 
                                                value={spec.label} 
                                                onChange={(e) => handleSpecChange(index, "label", e.target.value)}
                                                placeholder="Label"
                                                className="bg-gray-50"
                                            />
                                            <Input 
                                                value={spec.value} 
                                                onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                                                placeholder="Value"
                                                className="col-span-2"
                                            />
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={() => setSpecs([...specs, {label: "", value: ""}])}>
                                        + Tambah Baris
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="pedigree">
                            <Card>
                                <CardContent className="pt-6 space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        {/* Sire (Bapak) */}
                                        <div className="space-y-3 p-3 border rounded-lg">
                                            <h4 className="font-bold text-center text-blue-600">Jantan (Sire)</h4>
                                            <div className="space-y-1">
                                                <Label>Nama</Label>
                                                <Input 
                                                    value={pedigree.sire.name} 
                                                    onChange={(e) => handlePedigreeChange('sire', 'name', e.target.value)} 
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label>Ring/Galur</Label>
                                                <Input 
                                                     value={pedigree.sire.ring} 
                                                     onChange={(e) => handlePedigreeChange('sire', 'ring', e.target.value)} 
                                                />
                                            </div>
                                        </div>

                                        {/* Dam (Induk) */}
                                        <div className="space-y-3 p-3 border rounded-lg">
                                            <h4 className="font-bold text-center text-pink-600">Betina (Dam)</h4>
                                            <div className="space-y-1">
                                                <Label>Nama</Label>
                                                 <Input 
                                                    value={pedigree.dam.name} 
                                                    onChange={(e) => handlePedigreeChange('dam', 'name', e.target.value)} 
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label>Ring/Galur</Label>
                                                 <Input 
                                                     value={pedigree.dam.ring} 
                                                     onChange={(e) => handlePedigreeChange('dam', 'ring', e.target.value)} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Label>Generasi (F?)</Label>
                                        <Input 
                                            value={pedigree.f} 
                                            onChange={(e) => setPedigree({...pedigree, f: e.target.value})}
                                            className="w-24" 
                                            placeholder="F2/F3..."
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="media">
                             <Card>
                                <CardContent className="pt-6 space-y-4">
                                     <div className="space-y-2">
                                        <Label>Link Youtube Utama (Embed URL atau ID)</Label>
                                        <Input 
                                            value={videos.main}
                                            onChange={(e) => setVideos({...videos, main: e.target.value})}
                                            placeholder="https://www.youtube.com/embed/..."
                                        />
                                        <p className="text-xs text-gray-400">Pastikan gunakan format Embed dari Youtube</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    <Card>
                         <CardContent className="pt-6">
                            <h3 className="font-bold mb-4">Aksi</h3>
                            <Button type="submit" disabled={loading} className="w-full bg-emerald-800 hover:bg-emerald-900 mb-2">
                                {loading ? "Menyimpan..." : (isEdit ? "Update Perubahan" : "Publish Koleksi")}
                            </Button>
                            <Button type="button" variant="outline" className="w-full" onClick={() => router.back()}>
                                Batal
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    )
}
