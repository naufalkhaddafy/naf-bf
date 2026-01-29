"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, MessageCircle } from "lucide-react"
import { submitLead } from "@/actions/leads"
import { Turnstile } from "@marsidev/react-turnstile"

interface ContactButtonProps {
    children?: React.ReactNode
    className?: string
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    message?: string // Pre-filled message
    size?: "default" | "sm" | "lg" | "icon"
    asChild?: boolean
}

export function ContactButton({ 
    children, 
    className, 
    variant = "default", 
    message = "Halo Naf Aviary, saya tertarik dengan koleksi burung Anda.",
    size = "default",
    asChild = false
}: ContactButtonProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState<string>("")
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        message: message
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!token) {
            alert("Mohon selesaikan verifikasi anti-bot.")
            return
        }

        setLoading(true)

        const data = new FormData()
        data.append("name", formData.name)
        data.append("phone", formData.phone)
        data.append("message", formData.message)
        data.append("token", token)

        try {
            const result = await submitLead(null, data)

            if (result.success) {
                // Redirect to WhatsApp
                const waNumber = "6281234567890" // NAF Aviary Number
                const encodedMessage = encodeURIComponent(
                    `Halo NAF Aviary,\n\nSaya ${formData.name}.\n${formData.message}`
                )
                const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`
                
                window.open(waUrl, '_blank')
                setOpen(false)
                setFormData({ name: "", phone: "", message: message }) // Reset
                setToken("") // Reset token
            } else {
                alert(result.message || "Gagal mengirim data.")
            }
        } catch (err) {
            console.error('Unexpected error:', err)
            alert("Terjadi kesalahan sistem.")
        } finally {
            setLoading(false)
        }
    }

    // Default trigger if no children provided
    const trigger = children ? (
        <div onClick={(e) => e.stopPropagation()} className={asChild ? "contents" : ""}>
             {children}
        </div>
    ) : (
        <Button variant={variant} size={size} className={className}>
            <MessageCircle className="w-4 h-4 mr-2" />
            Hubungi Kami
        </Button>
    )

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-emerald-800 font-serif text-xl">Mulai Konsultasi</DialogTitle>
                    <DialogDescription>
                        Isi data diri Anda sebelum terhubung ke WhatsApp kami. Konsultasi gratis!
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-emerald-900">Nama Lengkap</Label>
                        <Input 
                            id="name" 
                            placeholder="Contoh: Budi Santoso" 
                            required 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="border-emerald-100 focus:border-emerald-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-emerald-900">Nomor WhatsApp</Label>
                        <Input 
                            id="phone" 
                            placeholder="08123456789" 
                            required 
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="border-emerald-100 focus:border-emerald-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message" className="text-emerald-900">Pesan</Label>
                        <Textarea 
                            id="message" 
                            placeholder="Apa yang ingin Anda tanyakan?" 
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                            className="min-h-[100px] border-emerald-100 focus:border-emerald-500"
                        />
                    </div>

                    <div className="flex justify-center overflow-hidden">
                        <Turnstile 
                            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                            onSuccess={(token) => setToken(token)}
                            options={{
                                theme: 'light',
                                size: 'flexible'
                            }}
                        />
                    </div>

                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold" disabled={loading || !token}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Menghubungkan...
                            </>
                        ) : (
                            <>
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Lanjut ke WhatsApp
                            </>
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
