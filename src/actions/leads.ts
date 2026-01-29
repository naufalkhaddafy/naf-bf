"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

export async function submitLead(state: unknown, formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const message = formData.get("message") as string
  const token = formData.get("token") as string
  
  // Basic validation
  if (!name || !phone) {
    return { success: false, message: "Nama dan Nomor Telepon wajib diisi." }
  }

  // Turnstile Verification
  if (process.env.TURNSTILE_SECRET_KEY) { // verify only if key starts configured
    if (!token) {
        return { success: false, message: "Mohon selesaikan verifikasi anti-bot." }
    }
    
    const ip = (await headers()).get("x-forwarded-for")
    
    const verifyFormData = new FormData()
    verifyFormData.append("secret", process.env.TURNSTILE_SECRET_KEY)
    verifyFormData.append("response", token)
    if (ip) verifyFormData.append("remoteip", ip)

    try {
        const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            body: verifyFormData,
        })
        const outcome = await result.json()
        if (!outcome.success) {
            console.error("Turnstile verification failed:", outcome)
            return { success: false, message: "Verifikasi anti-bot gagal. Silakan coba lagi." }
        }
    } catch (e) {
        console.error("Turnstile error:", e)
        return { success: false, message: "Terjadi kesalahan saat memverifikasi." }
    }
  }

  const { error } = await supabase.from("leads").insert({
    name,
    phone,
    message,
    status: "new"
  })

  if (error) {
    console.error("Lead Error:", error)
    return { success: false, message: "Gagal menyimpan data. Silakan coba lagi." }
  }

  revalidatePath("/admin/leads")
  return { success: true, message: "Data berhasil disimpan." }
}
