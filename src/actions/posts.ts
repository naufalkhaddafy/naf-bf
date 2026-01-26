"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createPost(formData: FormData) {
  const supabase = await createClient()

  const title = formData.get("title") as string
  const slug = formData.get("slug") as string || title.toLowerCase().replace(/ /g, "-") + "-" + Date.now().toString().slice(-4)
  const price = formData.get("price") as string
  const code = formData.get("code") as string
  const description = formData.get("description") as string
  const status = formData.get("status") as string
  const image_url = formData.get("image_url") as string
  
  // JSON Fields
  const specsRaw = formData.get("specs") as string
  const pedigreeRaw = formData.get("pedigree") as string
  const videosRaw = formData.get("videos") as string

  // Basic validation
  if (!title) return { error: "Title is required" }

  const { error } = await supabase.from("posts").insert({
    title,
    slug,
    price: price ? parseFloat(price) : null, 
    code: code || null,
    status: status || 'available',
    type: "bird",
    content: description, 
    image_url: image_url || null,
    specs: specsRaw ? JSON.parse(specsRaw) : [],
    pedigree: pedigreeRaw ? JSON.parse(pedigreeRaw) : {},
    videos: videosRaw ? JSON.parse(videosRaw) : {},
    is_published: true
  })

  if (error) {
    console.error("Error creating post:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/posts")
  revalidatePath("/collection")
  redirect("/admin/posts")
}

export async function deletePost(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from("posts").delete().eq("id", id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath("/admin/posts")
    revalidatePath("/collection")
}

export async function updatePost(id: string, prevState: any, formData: FormData) {
  const supabase = await createClient()

  const title = formData.get("title") as string
  const slug = formData.get("slug") as string 
  const price = formData.get("price") as string
  const description = formData.get("description") as string
  const status = formData.get("status") as string // Assuming status field exists in form

  if (!title) return { error: "Title is required" }

  const { error } = await supabase.from("posts").update({
    title,
    slug: slug || undefined, // Only update if provided
    price: price ? parseFloat(price) : null,
    status: status || "available", // default available
    content: description,
    updated_at: new Date().toISOString(),
  }).eq("id", id)

  if (error) {
    console.error("Error updating post:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/posts")
  revalidatePath("/collection")
  redirect("/admin/posts")
}
