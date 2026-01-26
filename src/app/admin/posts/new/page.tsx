"use client"

import { PostForm } from "@/components/admin/PostForm"

export default function NewPostPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
            <h1 className="text-2xl font-serif font-bold text-emerald-900">Tambah Koleksi Baru</h1>
            <PostForm />
        </div>
    )
}
