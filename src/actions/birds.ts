"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

interface GetBirdsParams {
  query?: string
  gender?: string
  status?: string
  sort?: string
  startDate?: string
  endDate?: string
  offset?: number
  limit?: number
}

export async function getBirds(filters?: GetBirdsParams) {
  const supabase = await createClient()
  const offset = filters?.offset ?? 0
  const limit = filters?.limit ?? 100 // Default to 100 if no limit specified (backward compatibility)

  let query = supabase
    .from("birds")
    .select("*", { count: 'exact' })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (filters?.query) {
    // Search in code or species
    query = query.or(`code.ilike.%${filters.query}%,species.ilike.%${filters.query}%`)
  }

  if (filters?.gender && filters.gender !== "all") {
    query = query.eq("gender", filters.gender)
  }

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status)
  }
  
  if (filters?.startDate) {
      query = query.gte("birth_date", filters.startDate)
  }
  
  if (filters?.endDate) {
      query = query.lte("birth_date", filters.endDate)
  }

  const { data, count, error } = await query

  if (error) {
    console.error("Error fetching birds:", error)
    return { birds: [], total: 0 }
  }

  return { birds: data || [], total: count || 0 }
}


export async function deleteBird(id: string) {
  const supabase = await createClient()

  // 1. Get bird data first to find images
  const { data: bird } = await supabase
    .from("birds")
    .select("images")
    .eq("id", id)
    .single()

  if (bird?.images && bird.images.length > 0) {
    // Extract file paths from URLs
    // Expected URL format: .../storage/v1/object/public/media/birds/filename.jpg
    const filesToRemove = bird.images.map((url: string) => {
      // Split by "media/" and take the last part (e.g., "birds/filename.jpg")
      const parts = url.split("/media/")
      if (parts.length > 1) return parts[1]
      return null
    }).filter((path: string | null) => path !== null) as string[]

    if (filesToRemove.length > 0) {
      const { error: storageError } = await supabase.storage
        .from("media")
        .remove(filesToRemove)
      
      if (storageError) {
        console.error("Error cleaning up storage:", storageError)
        // We continue with deletion even if storage cleanup fails, 
        // but log it. Optionally we could stop here.
      }
    }
  }

  // 2. Delete Bird Record
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
  price: number
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
      status: data.birdStatus,
      price: data.price
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
      status: data.birdStatus,
      price: data.price
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

// Get birds that are NOT already linked to any post (except the current post being edited)
export async function getAvailableBirdsForPost(filters?: { query?: string; excludePostId?: string }) {
  const supabase = await createClient()
  
  // 1. Get all bird_ids currently linked to posts (excluding current post if editing)
  let linkQuery = supabase.from("post_birds").select("bird_id")
  
  // If editing a post, exclude birds from that post (they should be available for re-selection)
  if (filters?.excludePostId) {
    linkQuery = linkQuery.neq("post_id", filters.excludePostId)
  }
  
  const { data: linkedBirds, error: linkError } = await linkQuery
  
  if (linkError) {
    console.error("Error fetching linked birds:", linkError)
    return []
  }
  
  const linkedBirdIds = linkedBirds?.map(pb => pb.bird_id) || []
  
  // 2. Query birds excluding linked ones
  let query = supabase
    .from("birds")
    .select("*")
    .order("created_at", { ascending: false })
  
  // Exclude already linked birds (from other posts)
  if (linkedBirdIds.length > 0) {
    query = query.not("id", "in", `(${linkedBirdIds.join(",")})`)
  }
  
  // Search filter
  if (filters?.query) {
    query = query.or(`code.ilike.%${filters.query}%,species.ilike.%${filters.query}%`)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error("Error fetching available birds:", error)
    return []
  }
  
  return data
}

export async function getBreeders() {
  const supabase = await createClient()
  
  // Fetch birds with status 'breeder'
  const { data, error } = await supabase
    .from("birds")
    .select("id, code, species, gender")
    .eq("status", "breeder")
    .order("code", { ascending: true })

  if (error) {
    console.error("Error fetching breeders:", error)
    return []
  }

  return data || []
}
