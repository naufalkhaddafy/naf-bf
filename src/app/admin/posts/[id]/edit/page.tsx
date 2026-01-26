import { createClient } from "@/lib/supabase/server"
import { PostForm } from "@/components/admin/PostForm"
import { notFound } from "next/navigation"

export default async function EditPostPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    
    // In Next.js 15, params is a promise, but in 14 it's an object. 
    // To be safe for both in this file we can access it directly if we know it's 14, or await it if 15.
    // Given the previous file used 'await params', it might be Next 15.
    // Let's try to handle it safely or just assume standard access for now as per other files.
    // However, since the existing file had `await params`, I will stick to that pattern if this is indeed Next 15.
    // But other files in this project (like [id]/page.tsx) are using `params.id` directly in my previous context views?
    // Let's check `collection/[id]/page.tsx`.
    
    const { id } = params // accessing directly based on typical Next 14 usage seen in other files (collection page) using `params.id`
    
    const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !post) {
        notFound()
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
            <h1 className="text-2xl font-serif font-bold text-emerald-900">Edit Koleksi</h1>
            <PostForm post={post} isEdit={true} />
        </div>
    )
}
