import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { redirect } from "next/navigation"
import { EditPostForm } from "./edit-post-form"

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: post, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single()

    if (error || !post) {
        redirect("/admin/posts")
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
             <h1 className="text-2xl font-bold">Edit Post</h1>
             <Card>
                <CardContent className="pt-6">
                    <EditPostForm post={post} />
                </CardContent>
             </Card>
        </div>
    )
}
