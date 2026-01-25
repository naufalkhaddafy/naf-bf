"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createPost(formData: FormData) {
  const supabase = await createClient()

  const title = formData.get("title") as string
  const slug = formData.get("slug") as string || title.toLowerCase().replace(/ /g, "-")
  const price = formData.get("price") as string
  const type = formData.get("type") as string
  const description = formData.get("description") as string
  
  // Basic validation
  if (!title) return { error: "Title is required" }

  const { error } = await supabase.from("posts").insert({
    title,
    slug,
    price: price ? parseFloat(price) : null, // Assuming I added 'price' column
    type: "bird", // forcing type for now or get from form
    content: description, // Mapping description to content
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
