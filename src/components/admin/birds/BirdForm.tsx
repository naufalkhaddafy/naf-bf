"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createClient } from "@/lib/supabase/client"
import { createBird, updateBird } from "@/actions/birds"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, Upload, X, Plus, Trash, Check, Bird, FileText, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

// Schema
const formSchema = z.object({
  code: z.string().min(1, "Ring Code wajib diisi"),
  species: z.string().min(1, "Spesies wajib diisi"),
  gender: z.string().min(1, "Pilih jenis kelamin"),
  birth_date: z.string().min(1, "Tanggal lahir wajib diisi"),
  description: z.string().optional(),
  birdStatus: z.string().min(1, "Status burung wajib dipilih"),
})

export function BirdForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // Initialize state from initialData if existing
  const [mediaFiles, setMediaFiles] = useState<{ url: string, file?: File }[]>(
    initialData?.images?.map((url: string) => ({ url })) || []
  )
  const [videoUrls, setVideoUrls] = useState<string[]>(
    initialData?.videos?.urls || []
  )
  const [currentVideo, setCurrentVideo] = useState("")
  const [videoError, setVideoError] = useState("")

  const [uploading, setUploading] = useState(false)
  const [specs, setSpecs] = useState<{label: string, value: string}[]>(
    initialData?.specs ? (typeof initialData.specs === 'string' ? JSON.parse(initialData.specs) : initialData.specs) : [{ label: "", value: "" }]
  )
  const [pedigree, setPedigree] = useState<{ayah: string, ibu: string}>(
    initialData?.pedigree || { ayah: "", ibu: "" }
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: initialData?.code || "",
      species: initialData?.species || "Murai Batu",
      gender: initialData?.gender || "male",
      birth_date: initialData?.birth_date || new Date().toISOString().split('T')[0],
      description: initialData?.description || "",
      birdStatus: initialData?.status || "available", // Note: DB column is 'status', form uses 'birdStatus'
    },
  })

  // Helper: Compress Image
  const compressImage = async (file: File): Promise<File> => {
    if (file.size <= 500 * 1024) return file

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = URL.createObjectURL(file)
      img.onload = () => {
        const canvas = document.createElement("canvas")
        let width = img.width
        let height = img.height
        const MAX_WIDTH = 1200
        const MAX_HEIGHT = 1200

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        ctx?.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Compression failed"))
              return
            }
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          },
          "image/jpeg",
          0.7
        )
      }
      img.onerror = (error) => reject(error)
    })
  }

  // Image Helper: Upload Single File to Supabase
  const uploadFileToSupabase = async (file: File): Promise<string> => {
    const supabase = createClient()
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `birds/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath)
      
    return publicUrl
  }

  // Handle Selection Only
  const handleImageSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setUploading(true)
    const files = Array.from(e.target.files)
    const newMediaItems: { url: string, file: File }[] = []
    
    toast.info(`Memproses ${files.length} gambar...`)

    for (const file of files) {
      try {
        let fileToProcess = file

        if (file.size > 500 * 1024) {
             fileToProcess = await compressImage(file)
        }

        const previewUrl = URL.createObjectURL(fileToProcess)
        newMediaItems.push({ url: previewUrl, file: fileToProcess })

      } catch (error) {
        console.error("Error processing file", error)
        toast.error(`Gagal memproses ${file.name}`)
      }
    }

    setMediaFiles(prev => [...prev, ...newMediaItems])
    setUploading(false)
    e.target.value = '' 
  }

  const removeImage = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Video Handlers
  const addVideo = () => {
    if (!currentVideo.trim()) return

    const result = z.string().url().safeParse(currentVideo)
    if (!result.success) {
        setVideoError("Link tidak valid! Harap masukkan URL yang benar")
        return
    }

    setVideoUrls(prev => [...prev, currentVideo.trim()])
    setCurrentVideo("")
    setVideoError("")
  }

  const removeVideo = (index: number) => {
    setVideoUrls(prev => prev.filter((_, i) => i !== index))
  }

  // Specs Handlers
  const addSpec = () => setSpecs([...specs, { label: "", value: "" }])
  const removeSpec = (index: number) => setSpecs(specs.filter((_, i) => i !== index))
  const updateSpec = (index: number, field: 'label' | 'value', value: string) => {
    const newSpecs = [...specs]
    newSpecs[index][field] = value
    setSpecs(newSpecs)
  }

  // Submit Handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      // 1. Upload Pending Images
      const finalImageUrls: string[] = []
      
      for (const item of mediaFiles) {
        if (item.file) {
            try {
                const publicUrl = await uploadFileToSupabase(item.file)
                finalImageUrls.push(publicUrl)
            } catch (error: any) {
                toast.error("Gagal mengupload gambar.")
                setLoading(false)
                return 
            }
        } else {
            finalImageUrls.push(item.url)
        }
      }

      const payload = {
        ...values,
        description: values.description || "",
        images: finalImageUrls,
        videos: { urls: videoUrls },
        pedigree,
        specs: JSON.stringify(specs.filter(s => s.label && s.value)),
      }

      let result;
      
      if (initialData) {
        // Update Mode
        // @ts-ignore
        result = await updateBird(initialData.id, payload)
      } else {
        // Create Mode
        // @ts-ignore
        result = await createBird(payload)
      }

      if (result.error) {
        toast.error("Gagal menyimpan data: " + result.error)
      } else {
        toast.success(initialData ? "Data burung berhasil diperbarui!" : "Burung berhasil ditambahkan!")
        router.push("/admin/birds")
        router.refresh()
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Section 1: Basic Info */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <Bird className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Identitas Burung</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="space-y-2">
                    <Label>Spesies</Label>
                    <Input {...form.register("species")} placeholder="Contoh: Murai Batu" />
                    {form.formState.errors.species && <p className="text-red-500 text-xs">{form.formState.errors.species.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label>Kode Ring / ID</Label>
                    <Input {...form.register("code")} placeholder="Contoh: MB-001" />
                    {form.formState.errors.code && <p className="text-red-500 text-xs">{form.formState.errors.code.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label>Jenis Kelamin</Label>
                    <Select onValueChange={(val) => form.setValue("gender", val)} defaultValue={form.getValues("gender")}>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih Gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Jantan (Male)</SelectItem>
                            <SelectItem value="female">Betina (Female)</SelectItem>
                            <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                    </Select>
                    {form.formState.errors.gender && <p className="text-red-500 text-xs">{form.formState.errors.gender.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label>Tanggal Lahir (Estimasi)</Label>
                    <Input type="date" {...form.register("birth_date")} />
                    {form.formState.errors.birth_date && <p className="text-red-500 text-xs">{form.formState.errors.birth_date.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label>Status Fisik</Label>
                    <Select onValueChange={(val) => form.setValue("birdStatus", val)} defaultValue={form.getValues("birdStatus")}>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="available">Available (Tersedia)</SelectItem>
                            <SelectItem value="sold">Sold (Terjual)</SelectItem>
                            <SelectItem value="booked">Booked (Dibooking)</SelectItem>
                            <SelectItem value="deceased">Deceased (Mati)</SelectItem>
                        </SelectContent>
                    </Select>
                     {form.formState.errors.birdStatus && <p className="text-red-500 text-xs">{form.formState.errors.birdStatus.message}</p>}
                </div>
            </div>
        </section>

        <section className="space-y-4">
             <div className="flex items-center gap-2 mb-4">
                 <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                     <FileText className="w-4 h-4" />
                 </div>
                 <h3 className="text-lg font-bold text-gray-800">Deskripsi</h3>
             </div>
             <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <div className="space-y-2">
                     <Label>Deskripsi / Keterangan</Label>
                     <Textarea {...form.register("description")} className="min-h-[120px]" placeholder="Jelaskan kondisi burung, karakter suara, prestasi, dll." />
                      {form.formState.errors.description && <p className="text-red-500 text-xs">{form.formState.errors.description.message}</p>}
                 </div>
             </div>
        </section>

         {/* Section 3: Media */}
         <section className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                    <ImageIcon className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Foto & Video</h3>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-6">
                {/* Images */}
                <div className="space-y-3">
                    <Label>Foto Burung</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {mediaFiles.map((item, idx) => (
                            <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
                                <img src={item.url} alt="Preview" className="w-full h-full object-cover" />
                                <button 
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                         <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors">
                            {uploading ? (
                                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                            ) : (
                                <>
                                    <Upload className="w-6 h-6 text-gray-400" />
                                    <span className="text-xs text-gray-500 font-medium">Upload Foto</span>
                                </>
                            )}
                            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelection} disabled={uploading} />
                        </label>
                    </div>
                </div>

                <Separator />

                {/* Videos */}
                <div className="space-y-3">
                    <Label>Video URL (YouTube / Lainnya)</Label>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Input 
                                value={currentVideo}
                                onChange={(e) => {
                                    setCurrentVideo(e.target.value)
                                    if (videoError) setVideoError("")
                                }}
                                placeholder="https://youtube.com/watch?v=..." 
                                className={`transition-all duration-200 ${videoError ? "border-red-500 focus-visible:ring-red-500 bg-red-50" : "focus-visible:ring-emerald-500"}`}
                            />
                            {videoError && <p className="text-red-500 text-xs mt-1 font-medium ml-1">{videoError}</p>}
                        </div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button 
                                type="button" 
                                onClick={addVideo} 
                                className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200 shadow-sm"
                            >
                                <Plus className="w-4 h-4 mr-2" /> Tambah
                            </Button>
                        </motion.div>
                    </div>
                    
                    <div className="space-y-2">
                        <AnimatePresence>
                        {videoUrls.map((url, idx) => (
                            <motion.div 
                                key={idx} 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100 group hover:border-emerald-200 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                                    <Bird className="w-4 h-4" /> 
                                </div>
                                <span className="text-sm text-gray-600 truncate flex-1">{url}</span>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeVideo(idx)} className="text-red-400 hover:text-red-600 hover:bg-red-50">
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </motion.div>
                        ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 4: Pedigree & Specs */}
        <section className="space-y-4">
             <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                    <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Data Tambahan (Silsilah & Spek)</h3>
            </div>

             <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <div>
                    <Label className="mb-2 block">Silsilah (Pedigree)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <span className="text-xs text-gray-500">Nama Ayah (Sire)</span>
                            <Input 
                                value={pedigree.ayah} 
                                onChange={(e) => setPedigree({...pedigree, ayah: e.target.value})} 
                                placeholder="Nama Bapak / Ring" 
                            />
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-gray-500">Nama Ibu (Dam)</span>
                             <Input 
                                value={pedigree.ibu} 
                                onChange={(e) => setPedigree({...pedigree, ibu: e.target.value})} 
                                placeholder="Nama Induk / Ring" 
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <Label>Spesifikasi Fisik</Label>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button 
                                type="button" 
                                size="sm" 
                                onClick={addSpec} 
                                className="h-8 gap-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            >
                                <Plus className="w-3 h-3" /> Tambah Spek
                            </Button>
                        </motion.div>
                    </div>
                    <div className="space-y-3">
                        {specs.map((spec, idx) => (
                            <motion.div 
                                key={idx} 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex gap-2"
                            >
                                <Input 
                                    className="flex-1"
                                    placeholder="Label (Mis: Ekor)" 
                                    value={spec.label}
                                    onChange={(e) => updateSpec(idx, 'label', e.target.value)}
                                />
                                <Input 
                                    className="flex-1"
                                    placeholder="Value (Mis: 18cm)" 
                                    value={spec.value}
                                    onChange={(e) => updateSpec(idx, 'value', e.target.value)}
                                />
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeSpec(idx)} className="text-red-400 hover:text-red-600">
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* Submit Action */}
        <div className="sticky bottom-4 z-10 flex justify-end">
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
                <Button 
                    type="submit" 
                    size="lg" 
                    disabled={loading} 
                    className="group bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white rounded-full px-8 shadow-xl shadow-emerald-900/20 py-6 text-base font-semibold tracking-wide transition-all duration-300"
                >
                    {loading ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2"
                        >
                            <Loader2 className="w-5 h-5 animate-spin" /> 
                            <span>Menyimpan...</span>
                        </motion.div>
                    ) : (
                        <motion.div 
                            className="flex items-center gap-2"
                            initial={{ x: 0 }}
                            whileHover={{ x: 3 }}
                        >
                            <Check className="w-5 h-5 bg-white/20 rounded-full p-0.5" />
                            <span>Simpan Data Burung</span>
                        </motion.div>
                    )}
                </Button>
            </motion.div>
        </div>

      </form>
    </div>
  )
}
