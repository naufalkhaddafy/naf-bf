import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bird, Users, DollarSign, Activity, FileText, MessageSquare } from "lucide-react"

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    // Real fetch implementation could be:
    const { count: postsCount } = await supabase.from('posts').select('*', { count: 'exact', head: true })
    const { count: leadsCount } = await supabase.from('leads').select('*', { count: 'exact', head: true })
    const { data: recentLeads } = await supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(5)

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-serif font-bold text-gray-800">Dashboard Overview</h1>
                <span className="text-sm text-gray-500">Welcome back, Admin</span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Koleksi</CardTitle>
                        <Bird className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{postsCount || 0}</div>
                        <p className="text-xs text-gray-400 mt-1">Burung terdaftar</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                         <CardTitle className="text-sm font-medium text-gray-500">Total Leads</CardTitle>
                         <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{leadsCount || 0}</div>
                        <p className="text-xs text-gray-400 mt-1">Kontak masuk</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                         <CardTitle className="text-sm font-medium text-gray-500">Estimasi Aset</CardTitle>
                         <DollarSign className="h-4 w-4 text-gold-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">IDR --</div>
                        <p className="text-xs text-gray-400 mt-1">Nilai koleksi aktif</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                         <CardTitle className="text-sm font-medium text-gray-500">Pengunjung</CardTitle>
                         <Activity className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">-</div>
                        <p className="text-xs text-gray-400 mt-1">Analytics belum aktif</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Leads Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Kontak Terbaru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentLeads?.map((lead) => (
                                <div key={lead.id} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-bold text-sm text-gray-800">{lead.name}</p>
                                        <p className="text-xs text-gray-500">{lead.phone}</p>
                                    </div>
                                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full">New</span>
                                </div>
                            )) || <p className="text-sm text-gray-500 italic">Belum ada data kontak.</p>}
                        </div>
                    </CardContent>
                </Card>
                
                 <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center">
                               <span className="relative flex h-2 w-2 mr-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">System Ready</p>
                                    <p className="text-xs text-muted-foreground">Panel Admin siap digunakan</p>
                                </div>
                                <div className="ml-auto font-medium text-xs text-gray-400">Now</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
