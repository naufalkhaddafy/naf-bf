import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { LogOut, LayoutDashboard, FileText, Settings, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }
  
  // Optional: Check role logic here (must be 'admin' in profiles)
  // const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  // if (profile?.role !== 'admin') { redirect('/') }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-900 text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-emerald-800">
            <h2 className="text-xl font-serif font-bold tracking-wide">NAF ADMIN</h2>
            <p className="text-xs text-emerald-300">Content Management</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-800 text-white font-medium hover:bg-emerald-700 transition">
                <LayoutDashboard className="w-5 h-5" /> Dashboard
            </Link>
             <Link href="/admin/posts" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-800 text-emerald-100 font-medium transition">
                <FileText className="w-5 h-5" /> Posts / Koleksi
            </Link>
             <Link href="/admin/leads" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-800 text-emerald-100 font-medium transition">
                <Users className="w-5 h-5" /> Leads
            </Link>
            <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-800 text-emerald-100 font-medium transition">
                <Settings className="w-5 h-5" /> Pengaturan
            </Link>
        </nav>

        <div className="p-4 border-t border-emerald-800">
             <form action="/auth/signout" method="post">
                <Button variant="ghost" className="w-full justify-start text-emerald-200 hover:text-white hover:bg-emerald-800 gap-3">
                    <LogOut className="w-5 h-5" /> Keluar
                </Button>
            </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  )
}
