"use client"

import { useActionState } from "react"
import { updatePost } from "@/actions/posts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type PostData = {
    id: string
    title: string
    slug: string
    price: number | null
    content: string | null
    status: string
}

export function EditPostForm({ post }: { post: PostData }) {
    const updatePostWithId = updatePost.bind(null, post.id)
    const [state, formAction, isPending] = useActionState(updatePostWithId, null)

    return (
        <form action={formAction} className="space-y-4">
            {state?.error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                    {state.error}
                </div>
            )}
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" defaultValue={post.title} required />
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" defaultValue={post.slug} />
            </div>

                <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" name="price" type="number" defaultValue={post.price?.toString() || ""} />
            </div>

                <div className="space-y-2">
                <Label htmlFor="description">Description (Content)</Label>
                <Textarea id="description" name="description" defaultValue={post.content || ""} className="min-h-[150px]" />
            </div>

                <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                    <select name="status" id="status" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" defaultValue={post.status || 'available'}>
                    <option value="available">Available (Ready Stock)</option>
                    <option value="sold">Sold</option>
                    <option value="archived">Archived</option>
                </select>
            </div>

            <div className="flex justify-end gap-3">
                <Button type="submit">Update Post</Button>
            </div>
        </form>
    )
}
