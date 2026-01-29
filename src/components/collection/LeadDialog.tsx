"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, MessageCircle } from "lucide-react"
import { submitLead } from "@/actions/leads"

export function LeadDialog({ birdTitle, className }: { birdTitle: string, className?: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    const result = await submitLead(null, formData)
    setLoading(false)

    if (result.success) {
        setOpen(false)
        // Redirect to WhatsApp
        const name = formData.get("name")
        const message = `Halo Naf Aviary, saya ${name}. Saya tertarik dengan *${birdTitle}*. Apakah masih tersedia?`
        const url = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`
        window.open(url, '_blank')
    } else {
        alert(result.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={className}>
             <MessageCircle className="w-5 h-5 md:w-6 md:h-6 mr-2" /> Beli Sekarang via WhatsApp
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hubungi Penjual</DialogTitle>
          <DialogDescription>
            Isi data diri singkat sebelum terhubung ke WhatsApp kami.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="grid gap-4 py-4">
             <input type="hidden" name="message" value={`Interest: ${birdTitle}`} />
          <div className="grid gap-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input id="name" name="name" placeholder="Budi Santoso" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Nomor WhatsApp</Label>
            <Input id="phone" name="phone" placeholder="08123xxx" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="note">Catatan Tambahan (Opsional)</Label>
            <Textarea id="note" placeholder="Saya ingin menawar, dll..." />
          </div>
          <Button type="submit" className="bg-emerald-800 hover:bg-emerald-900" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <MessageCircle className="w-4 h-4 mr-2" />}
            Lanjut ke WhatsApp
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
