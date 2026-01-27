import { getPostById } from "@/actions/posts"
import { PostEditForm } from "@/components/admin/posts/PostEditForm"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface EditPostPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
    const { id } = await params
    
    const post = await getPostById(id)

    if (!post) {
        notFound()
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link 
                    href="/admin/posts" 
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-900">Edit Post</h1>
                    <p className="text-gray-500 text-sm mt-0.5">Perbarui informasi postingan</p>
                </div>
            </div>

            <PostEditForm post={post} />
        </div>
    )
}
