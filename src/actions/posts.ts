"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

interface GetPostsParams {
  query?: string
  status?: string
  startDate?: string
  endDate?: string
  minPrice?: string
  maxPrice?: string
  offset?: number
  limit?: number
}

export async function getPosts(params: GetPostsParams = {}) {
  const supabase = await createClient()
  const { query, status, startDate, endDate, minPrice, maxPrice, offset = 0, limit = 20 } = params

  let dbQuery = supabase
    .from('posts')
    .select('*, post_birds(bird_id, birds(code, species, images))', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (query) {
    dbQuery = dbQuery.ilike('title', `%${query}%`)
  }

  if (status && status !== 'all') {
    dbQuery = dbQuery.eq('status', status)
  }

  if (startDate) {
    dbQuery = dbQuery.gte('created_at', startDate)
  }

  if (endDate) {
    dbQuery = dbQuery.lte('created_at', endDate + 'T23:59:59')
  }

  if (minPrice) {
    dbQuery = dbQuery.gte('price', parseFloat(minPrice))
  }

  if (maxPrice) {
    dbQuery = dbQuery.lte('price', parseFloat(maxPrice))
  }

  const { data, count, error } = await dbQuery

  if (error) {
    console.error("Error fetching posts:", error)
    return { posts: [], total: 0 }
  }

  return { posts: data || [], total: count || 0 }
}

export async function createPost(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const price = formData.get("price") as string
  const status = formData.get("status") as string
  const tagsRaw = formData.get("tags") as string
  const tags: string[] = tagsRaw ? JSON.parse(tagsRaw) : []
  const selectedBirdIdsRaw = formData.get("selectedBirdIds") as string
  const selectedBirdIds: string[] = selectedBirdIdsRaw ? JSON.parse(selectedBirdIdsRaw) : []

  // Validation
  if (!title) return { error: "Judul wajib diisi" }
  if (selectedBirdIds.length === 0) return { error: "Pilih minimal 1 burung" }

  // Determine type based on count (simple logic for now)
  const type = selectedBirdIds.length > 1 ? "pair" : "single"

  // 1. Create Post
  const { data: post, error: postError } = await supabase.from("posts").insert({
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString().slice(-4),
    content: description,
    price: price ? parseFloat(price) : 0,
    status: status || 'available',
    tags,
    type, 
    is_published: true
  }).select().single()

  if (postError) {
    console.error("Error creating post:", postError)
    return { error: postError.message }
  }

  // 2. Link Birds (post_birds)
  if (selectedBirdIds.length > 0) {
      const postBirdsData = selectedBirdIds.map(birdId => ({
          post_id: post.id,
          bird_id: birdId
      }))

      const { error: linkError } = await supabase.from("post_birds").insert(postBirdsData)
      
      if (linkError) {
          console.error("Error linking birds:", linkError)
          // Optional: Delete post if linking fails? Or just return error.
          return { error: "Post created but failed to link birds: " + linkError.message }
      }
  }

  revalidatePath("/admin/posts")
  revalidatePath("/collection") // If public page uses this
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

// Get a single post by ID with its linked birds
export async function getPostById(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select('*, post_birds(bird_id, birds(*))')
    .eq('id', id)
    .single()

  if (error) {
    console.error("Error fetching post:", error)
    return null
  }

  return data
}

export async function updatePost(id: string, prevState: any, formData: FormData) {
  const supabase = await createClient()

  const title = formData.get("title") as string
  const price = formData.get("price") as string
  const description = formData.get("description") as string
  const status = formData.get("status") as string
  const tagsRaw = formData.get("tags") as string
  const tags: string[] = tagsRaw ? JSON.parse(tagsRaw) : []
  const selectedBirdIdsRaw = formData.get("selectedBirdIds") as string
  const selectedBirdIds: string[] = selectedBirdIdsRaw ? JSON.parse(selectedBirdIdsRaw) : []

  if (!title) return { error: "Judul wajib diisi" }
  if (selectedBirdIds.length === 0) return { error: "Pilih minimal 1 burung" }

  const type = selectedBirdIds.length > 1 ? "pair" : "single"

  // 1. Update Post
  const { error: updateError } = await supabase.from("posts").update({
    title,
    price: price ? parseFloat(price) : 0,
    status: status || "available",
    content: description,
    tags,
    type,
    updated_at: new Date().toISOString(),
  }).eq("id", id)

  if (updateError) {
    console.error("Error updating post:", updateError)
    return { error: updateError.message }
  }

  // 2. Update Birds - delete old links and insert new ones
  // First delete existing links
  const { error: deleteLinksError } = await supabase
    .from("post_birds")
    .delete()
    .eq("post_id", id)

  if (deleteLinksError) {
    console.error("Error deleting old bird links:", deleteLinksError)
    return { error: "Failed to update bird links: " + deleteLinksError.message }
  }

  // Insert new links
  if (selectedBirdIds.length > 0) {
    const postBirdsData = selectedBirdIds.map(birdId => ({
      post_id: id,
      bird_id: birdId
    }))

    const { error: linkError } = await supabase.from("post_birds").insert(postBirdsData)
    
    if (linkError) {
      console.error("Error linking birds:", linkError)
      return { error: "Failed to link birds: " + linkError.message }
    }
  }

  revalidatePath("/admin/posts")
  revalidatePath("/collection")
  return { success: true }
}
// ... (existing code)

export async function getFavoritePosts(ids: string[]) {
  const supabase = await createClient()

  if (!ids || ids.length === 0) return []

  const { data: postsData, error } = await supabase
    .from('posts')
    .select('*, post_birds(bird_id, birds(*))')
    .in('id', ids)

  if (error) {
    console.error("Error fetching favorites:", error)
    return []
  }

  // Map to BirdCardProps format (Reusing logic from CollectionList)
  const formattedPosts = postsData?.map(post => {
      const linkedBirds = post.post_birds?.map((pb: any) => pb.birds).filter(Boolean) || []
      const birdImage = linkedBirds.find((b: any) => b?.images?.[0])?.images?.[0] || null
      const birdCodes = linkedBirds.map((b: any) => b?.code).filter(Boolean)
      
      const genders = linkedBirds.map((b: any) => b?.gender).filter(Boolean)
      const hasMale = genders.includes('male')
      const hasFemale = genders.includes('female')
      
      let badge = { text: 'Tersedia', color: 'bg-emerald-600' }
      if (post.status === 'sold') badge = { text: 'Terjual', color: 'bg-red-600' }
      else if (post.status === 'booked') badge = { text: 'Dipesan', color: 'bg-amber-500' }
      
      const postPrice = post.price || 0
      const totalBirdPrice = linkedBirds.reduce((sum: number, b: any) => sum + (b?.price || 0), 0)
      const hasDiscount = totalBirdPrice > postPrice && postPrice > 0
      
      return {
          id: post.id,
          slug: post.slug,
          title: post.title,
          rawPrice: postPrice, // Added for calculation
          price: post.price ? new Intl.NumberFormat('id-ID').format(post.price) : "Hubungi Kami",
          originalPrice: hasDiscount ? new Intl.NumberFormat('id-ID').format(totalBirdPrice) : null,
          birdCodes,
          tags: post.tags || [],
          type: post.type,
          hasMale,
          hasFemale,
          image_url: birdImage,
          description: post.content || "Belum ada deskripsi.",
          badge,
          sold: post.status === 'sold',
          booked: post.status === 'booked'
      }
  }) || []

  return formattedPosts
}
