import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, MessageSquare, Activity } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  // Real fetch implementation could be:
  // const { count: postCount } = await supabase.from('posts').select('*', { count: 'exact', head: true })
  // const { count: leadCount } = await supabase.from('leads').select('*', { count: 'exact', head: true })

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif font-bold text-emerald-900">Dashboard</h1>
        <span className="text-sm text-gray-500">Welcome back, Admin</span>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Koleksi</CardTitle>
                <FileText className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+2 bulan ini</p>
            </CardContent>
         </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Leads Masuk</CardTitle>
                <MessageSquare className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">145</div>
                <p className="text-xs text-muted-foreground">+12% dari minggu lalu</p>
            </CardContent>
         </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pengunjung</CardTitle>
                <Users className="h-4 w-4 text-gold-600" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">1,203</div>
                <p className="text-xs text-muted-foreground">+540 bulan ini</p>
            </CardContent>
         </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status System</CardTitle>
                <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-green-600">Healthy</div>
                <p className="text-xs text-muted-foreground">All services operational</p>
            </CardContent>
         </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Overview Penjualan</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                {/* Placeholder Chart */}
                <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-lg border border-dashed text-gray-400">
                    Chart Component Here
                </div>
            </CardContent>
        </Card>
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center">
                           <span className="relative flex h-2 w-2 mr-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">New Lead: Pak Budi</p>
                                <p className="text-xs text-muted-foreground">Menanyakan Cucak Rowo NAF-105</p>
                            </div>
                            <div className="ml-auto font-medium text-xs text-gray-400">2m ago</div>
                        </div>
                         <div className="flex items-center">
                            <span className="relative flex h-2 w-2 mr-3 bg-blue-500 rounded-full"></span>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">Post Updated</p>
                                <p className="text-xs text-muted-foreground">Edit "Anakan Jantan Prospek"</p>
                            </div>
                            <div className="ml-auto font-medium text-xs text-gray-400">1h ago</div>
                        </div>
                    </div>
                </CardContent>
            </CardHeader>
        </Card>
      </div>
    </div>
  )
}
