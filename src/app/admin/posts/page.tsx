import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Pencil, Trash2, Eye } from "lucide-react"
import { deletePost } from "@/actions/posts" // We need a client component for delete button usually, or form action

export default async function PostsPage() {
  const supabase = await createClient()
  const { data: posts, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif font-bold text-emerald-900">Kelola Koleksi</h1>
        <Button asChild className="bg-emerald-800 hover:bg-emerald-900 gap-2">
            <Link href="/admin/posts/new">
                <PlusCircle className="w-4 h-4" /> Tambah Baru
            </Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
         <Table>
            <TableCaption>Daftar koleksi burung.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {posts && posts.length > 0 ? (
                    posts.map((post) => (
                        <TableRow key={post.id}>
                            <TableCell className="font-medium">{post.title}</TableCell>
                            <TableCell>{post.slug}</TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${post.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {post.is_published ? 'Published' : 'Draft'}
                                </span>
                            </TableCell>
                            <TableCell className="text-right flex justify-end gap-2">
                                <Button variant="ghost" size="icon" asChild>
                                    <Link href={`/collection/${post.id}`} target="_blank">
                                        <Eye className="w-4 h-4 text-gray-500" />
                                    </Link>
                                </Button>
                                <Button variant="ghost" size="icon" asChild>
                                    <Link href={`/admin/posts/${post.id}/edit`}>
                                        <Pencil className="w-4 h-4 text-blue-500" />
                                    </Link>
                                </Button>
                                <form action={async () => {
                                    "use server"
                                    await deletePost(post.id)
                                }}>
                                    <Button variant="ghost" size="icon" type="submit">
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </form>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center h-24 text-gray-500">
                            Belum ada data koleksi. Silakan tambah baru.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
      </div>
    </div>
  )
}
