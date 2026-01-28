import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bird, Users, DollarSign, Activity, Plus, TrendingUp, TrendingDown, Clock, ArrowRight, Sparkles, FileText } from "lucide-react"
import Link from "next/link"

// Helper to format currency
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value)
}

// Helper for time-based greeting
const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Selamat Pagi"
    if (hour < 17) return "Selamat Siang"
    if (hour < 20) return "Selamat Sore"
    return "Selamat Malam"
}

// Helper to format relative time
const formatTimeAgo = (date: string) => {
    const now = new Date()
    const past = new Date(date)
    const diffMs = now.getTime() - past.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Baru saja"
    if (diffMins < 60) return `${diffMins} menit lalu`
    if (diffHours < 24) return `${diffHours} jam lalu`
    return `${diffDays} hari lalu`
}

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    // Fetch all dashboard data
    const [
        { count: postsCount },
        { count: leadsCount },
        { count: birdsCount },
        { count: subscribersCount },
        { data: recentLeads },
        { data: birds },
    ] = await Promise.all([
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('birds').select('*', { count: 'exact', head: true }),
        supabase.from('subscribers').select('*', { count: 'exact', head: true }),
        supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('birds').select('species, price').limit(100),
    ])

    // Calculate total asset value from birds
    const totalAssetValue = birds?.reduce((acc, bird) => acc + (bird.price || 0), 0) || 0

    // Group birds by species for chart
    const speciesCount = birds?.reduce((acc, bird) => {
        acc[bird.species] = (acc[bird.species] || 0) + 1
        return acc
    }, {} as Record<string, number>) || {}

    const speciesData = Object.entries(speciesCount).slice(0, 5)
    const maxSpeciesCount = Math.max(...speciesData.map(([, count]) => count), 1)

    // Stats data
    const stats = [
        {
            title: "Total Koleksi",
            value: birdsCount || 0,
            subtitle: "Burung terdaftar",
            icon: Bird,
            gradient: "stat-card-emerald",
            glow: "hover-glow-emerald",
            trend: "+12%",
            trendUp: true,
        },
        {
            title: "Total Leads",
            value: leadsCount || 0,
            subtitle: "Kontak masuk",
            icon: Users,
            gradient: "stat-card-blue",
            glow: "hover-glow-blue",
            trend: "+5%",
            trendUp: true,
        },
        {
            title: "Estimasi Aset",
            value: formatCurrency(totalAssetValue),
            subtitle: "Nilai koleksi aktif",
            icon: DollarSign,
            gradient: "stat-card-gold",
            glow: "hover-glow-gold",
            trend: null,
            trendUp: false,
            isGold: true,
        },
        {
            title: "Subscribers",
            value: subscribersCount || 0,
            subtitle: "Newsletter aktif",
            icon: Activity,
            gradient: "stat-card-purple",
            glow: "hover-glow-purple",
            trend: "+8%",
            trendUp: true,
        },
    ]

    // Quick actions
    const quickActions = [
        { label: "Tambah Burung", href: "/admin/birds/new", icon: Bird },
        { label: "Buat Post", href: "/admin/posts/new", icon: FileText },
        { label: "Lihat Leads", href: "/admin/leads", icon: Users },
    ]

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 p-8 text-white shadow-2xl">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-emerald-600/20 to-transparent rounded-full blur-3xl" />
                    <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-gold-500/10 to-transparent rounded-full blur-3xl" />
                </div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                            <span className="text-emerald-200 text-sm font-medium">Dashboard Admin</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
                            {getGreeting()}, <span className="gradient-text-gold">Admin</span>! 👋
                        </h1>
                        <p className="text-emerald-100/80 text-sm md:text-base">
                            Kelola koleksi burung premium Anda dengan mudah.
                        </p>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-2 md:gap-3">
                        {quickActions.map((action) => (
                            <Link key={action.href} href={action.href}>
                                <Button 
                                    variant="secondary" 
                                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm rounded-xl gap-2 transition-all hover:scale-105"
                                >
                                    <action.icon className="w-4 h-4" />
                                    <span className="hidden sm:inline">{action.label}</span>
                                    <Plus className="w-3 h-3 sm:hidden" />
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={stat.title}
                        className={`group relative rounded-2xl ${stat.gradient} ${stat.glow} p-6 text-white shadow-lg hover-lift overflow-hidden`}
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {/* Shimmer overlay */}
                        <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        
                        {/* Background pattern */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                        
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                {stat.trend && (
                                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                                        stat.trendUp ? 'bg-white/20' : 'bg-red-400/30'
                                    }`}>
                                        {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                        {stat.trend}
                                    </div>
                                )}
                            </div>
                            
                            <div className="space-y-1">
                                <p className="text-white/80 text-sm font-medium">{stat.title}</p>
                                <p className={`text-3xl font-bold tracking-tight animate-counter ${stat.isGold ? 'text-lg md:text-xl' : ''}`}>
                                    {stat.value}
                                </p>
                                <p className="text-white/60 text-xs">{stat.subtitle}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Species Distribution Chart */}
                <Card className="lg:col-span-1 glass-card border-0 rounded-2xl overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-serif flex items-center gap-2">
                            <Bird className="w-5 h-5 text-emerald-600" />
                            Distribusi Spesies
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {speciesData.length > 0 ? (
                                speciesData.map(([species, count], index) => {
                                    const percentage = (count / maxSpeciesCount) * 100
                                    const colors = [
                                        'bg-emerald-500',
                                        'bg-blue-500',
                                        'bg-amber-500',
                                        'bg-purple-500',
                                        'bg-rose-500',
                                    ]
                                    return (
                                        <div key={species} className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium text-gray-700 capitalize">{species}</span>
                                                <span className="text-gray-500">{count} ekor</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${colors[index % colors.length]} rounded-full transition-all duration-1000`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    <Bird className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Belum ada data burung</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Leads */}
                <Card className="lg:col-span-2 glass-card border-0 rounded-2xl overflow-hidden">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-serif flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-600" />
                            Kontak Terbaru
                        </CardTitle>
                        <Link href="/admin/leads">
                            <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 gap-1">
                                Lihat Semua <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentLeads && recentLeads.length > 0 ? (
                                recentLeads.map((lead, index) => (
                                    <div
                                        key={lead.id}
                                        className="group flex items-center gap-4 p-3 rounded-xl bg-gray-50/50 hover:bg-white hover:shadow-md transition-all duration-300"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        {/* Avatar */}
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
                                            {lead.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        
                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-800 truncate">{lead.name}</p>
                                            <p className="text-sm text-gray-500 truncate">{lead.phone}</p>
                                        </div>
                                        
                                        {/* Time & Status */}
                                        <div className="text-right">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                                                Baru
                                            </span>
                                            <p className="text-xs text-gray-400 mt-1 flex items-center justify-end gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatTimeAgo(lead.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-gray-400">
                                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Belum ada kontak masuk</p>
                                    <p className="text-xs mt-1">Leads akan muncul di sini</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Activity & Posts Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Activity Timeline */}
                <Card className="glass-card border-0 rounded-2xl overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-serif flex items-center gap-2">
                            <Activity className="w-5 h-5 text-purple-600" />
                            Aktivitas Terbaru
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* System Status */}
                            <div className="relative flex items-start gap-4 timeline-connector pb-4">
                                <div className="relative z-10">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800 text-sm">Sistem Aktif</p>
                                    <p className="text-xs text-gray-500">Panel Admin siap digunakan</p>
                                </div>
                                <span className="text-xs text-gray-400">Sekarang</span>
                            </div>

                            {/* Posts Info */}
                            <div className="relative flex items-start gap-4 pb-4">
                                <div className="relative z-10">
                                    <span className="relative flex h-3 w-3">
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-400"></span>
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800 text-sm">Marketplace Posts</p>
                                    <p className="text-xs text-gray-500">{postsCount || 0} listing aktif</p>
                                </div>
                                <span className="text-xs text-gray-400">Info</span>
                            </div>

                            {/* Collection Info */}
                            <div className="relative flex items-start gap-4">
                                <div className="relative z-10">
                                    <span className="relative flex h-3 w-3">
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800 text-sm">Koleksi Burung</p>
                                    <p className="text-xs text-gray-500">{birdsCount || 0} burung terdaftar</p>
                                </div>
                                <span className="text-xs text-gray-400">Info</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Stats Summary */}
                <Card className="glass-card border-0 rounded-2xl overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-serif flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-500" />
                            Ringkasan Cepat
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <Bird className="w-4 h-4 text-emerald-600" />
                                    <span className="text-xs font-medium text-emerald-700">Burung</span>
                                </div>
                                <p className="text-2xl font-bold text-emerald-900">{birdsCount || 0}</p>
                            </div>
                            
                            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    <span className="text-xs font-medium text-blue-700">Posts</span>
                                </div>
                                <p className="text-2xl font-bold text-blue-900">{postsCount || 0}</p>
                            </div>
                            
                            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="w-4 h-4 text-purple-600" />
                                    <span className="text-xs font-medium text-purple-700">Leads</span>
                                </div>
                                <p className="text-2xl font-bold text-purple-900">{leadsCount || 0}</p>
                            </div>
                            
                            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <DollarSign className="w-4 h-4 text-amber-600" />
                                    <span className="text-xs font-medium text-amber-700">Aset</span>
                                </div>
                                <p className="text-lg font-bold text-amber-900">{formatCurrency(totalAssetValue).replace('IDR', '').trim()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
