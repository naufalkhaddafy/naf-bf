"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function submitLead(state: unknown, formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const message = formData.get("message") as string
  
  // Basic validation
  if (!name || !phone) {
    return { success: false, message: "Nama dan Nomor Telepon wajib diisi." }
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
