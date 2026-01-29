"use server"

import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export async function loginAction(prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const token = formData.get("token") as string

  // 1. Verify Turnstile Token
  if (process.env.TURNSTILE_SECRET_KEY) {
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
          return { success: false, message: "Terjadi kesalahan saat memverifikasi keamanan." }
      }
  }

  // 2. Authenticate with Supabase
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, message: "Email atau password salah." }
  }

  // 3. Redirect on success
  redirect("/admin")
}
