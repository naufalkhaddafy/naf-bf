"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getBirds() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("birds")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching birds:", error)
    return []
  }

  return data
}


export async function deleteBird(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("birds").delete().eq("id", id)

  if (error) {
    console.error("Error deleting bird:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/birds")
  return {}
}

interface CreateBirdData {
  // Bird Data
  code: string
  species: string
  gender: string
  birth_date: string
  description: string
  images: string[]
  videos: any
  pedigree: any
  specs: any
  birdStatus: string // 'available', 'sold', etc.
  slug: string // Still needed for bird page URL? Or maybe just use ID/Code? Let's keep it if generated, or remove if not.
               // Update: BirdForm passes 'slug' but maybe we don't need it if we navigate by ID. 
               // However, to keep it simple, let's keep it or remove it. 
               // Looking at BirdForm, it still generates a slug. Let's keep it for now but maybe it's not needed in DB if not column.
               // Wait, `birds` table doesn't have slug column in migration 20260127... 
               // Let's check migration again.
               // Ah, `birds` table has: id, code, species, gender, birth_date, description, image_url (text[]), video_url, pedigree, specs, status.
               // It does NOT have slug. Post has slug.
               // So remove slug from CreateBirdData and BirdForm payload.
}

export async function createBird(data: CreateBirdData) {
  const supabase = await createClient()

  // 1. Create Bird
  const { data: bird, error: birdError } = await supabase
    .from("birds")
    .insert({
      code: data.code,
      species: data.species,
      gender: data.gender,
      birth_date: data.birth_date,
      description: data.description,
      images: data.images,
      videos: data.videos,
      pedigree: data.pedigree,
      specs: data.specs,
      status: data.birdStatus
    })
    .select()
    .single()

  if (birdError) {
    console.error("Error creating bird:", birdError)
    return { error: `Bird Error: ${birdError.message}` }
  }

  revalidatePath("/admin/birds")
  
  return { success: true, birdId: bird.id }
}

export async function getBirdById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("birds")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) {
    console.error(`Error fetching bird [${id}]:`, JSON.stringify(error, null, 2))
    return null
  }

  if (!data) {
    console.warn(`Bird NOT FOUND with ID: ${id}`)
    return null
  }

  return data
}

export async function updateBird(id: string, data: any) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("birds")
    .update({
      code: data.code,
      species: data.species,
      gender: data.gender,
      birth_date: data.birth_date,
      description: data.description,
      images: data.images,
      videos: data.videos,
      pedigree: data.pedigree,
      specs: data.specs,
      status: data.birdStatus
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating bird:", error)
    return { error: `Update Error: ${error.message}` }
  }

  revalidatePath("/admin/birds")
  revalidatePath(`/admin/birds/${id}`)
  
  return { success: true }
}
