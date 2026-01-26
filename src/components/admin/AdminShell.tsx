"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { useState } from "react"
import { LayoutDashboard, FileText, Users, Settings, LogOut, Menu, Bird, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

interface AdminShellProps {
    children: React.ReactNode
    userEmail?: string
}

export function AdminShell({ children, userEmail }: AdminShellProps) {
    const pathname = usePathname()
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    const navItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/posts", label: "Koleksi Burung", icon: Bird },
        { href: "/admin/leads", label: "Leads / Kontak", icon: Users },
        { href: "/admin/settings", label: "Pengaturan", icon: Settings },
    ]

    const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/")

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white border-r border-gray-100">
            <div className="p-6 flex items-center gap-3 border-b border-gray-100">
                <div className="w-8 h-8 bg-emerald-900 rounded-lg flex items-center justify-center overflow-hidden">
                    <Image src="/icon/icon.png" alt="Logo" width={32} height={32} className="w-full h-full object-contain" />
                </div>
                <div>
                    <h2 className="font-serif font-bold text-lg text-gold-600 leading-none">NAF BIRD</h2>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Admin Panel</p>
                </div>
            </div>

            <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <Link 
                        key={item.href} 
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                            ${isActive(item.href) && item.href !== '/admin' || (item.href === '/admin' && pathname === '/admin')
                                ? "bg-emerald-50 text-emerald-900 shadow-sm border border-emerald-100" 
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }
                        `}
                    >
                        <item.icon className={`w-4 h-4 ${isActive(item.href) ? "text-emerald-700" : "text-gray-400 group-hover:text-gray-600"}`} />
                        {item.label}
                    </Link>
                ))}
            </div>

            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 mb-2">
                    <Avatar className="w-8 h-8 h-8 w-8">
                        <AvatarFallback className="bg-emerald-200 text-emerald-800 text-xs">A</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-bold text-gray-900 truncate">{userEmail || "Admin"}</p>
                        <p className="text-[10px] text-gray-500 truncate">Super Admin</p>
                    </div>
                </div>
                <form action="/auth/signout" method="post">
                    <Button variant="ghost" size="sm" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 gap-2 h-9">
                        <LogOut className="w-4 h-4" /> Sign Out
                    </Button>
                </form>
            </div>
        </div>
    )

    return (
        <div className="flex h-screen bg-gray-50/50">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 h-full fixed inset-y-0 left-0 z-30">
                <SidebarContent />
            </aside>

            {/* Mobile Header & Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sticky top-0 z-20">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-900 rounded-lg flex items-center justify-center overflow-hidden">
                            <Image src="/icon/icon.png" alt="Logo" width={32} height={32} className="w-full h-full object-contain" />
                        </div>
                        <h2 className="font-serif font-bold text-lg text-gold-600">NAF</h2>
                    </div>

                    <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 border-r-0 w-72">
                            <SidebarContent />
                        </SheetContent>
                    </Sheet>
                </header>

                {/* Top Desktop Header (Optional: For breadcrumbs/actions) */}
                <header className="hidden md:flex h-16 bg-white/50 backdrop-blur-sm border-b border-gray-100 items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center text-sm text-gray-500">
                        <span className="font-medium text-gray-900">Admin Panel</span>
                        <span className="mx-2">/</span>
                        <span className="capitalize">{pathname.split('/').pop() || 'Dashboard'}</span>
                    </div>
                     <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" className="hidden lg:flex" asChild>
                            <Link href="/" target="_blank">Lihat Website</Link>
                        </Button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-4 md:p-8">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
