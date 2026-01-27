import Link from "next/link"
import { PostForm } from "@/components/admin/posts/PostForm"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NewPostPage() {
    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-gray-100">
                    <Link href="/admin/posts">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-serif font-bold text-emerald-900">Buat Post Baru</h1>
            </div>
            <PostForm />
        </div>
    )
}
