"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { LayoutDashboard, FileText, Users, Settings, LogOut, Menu, Bird, X, ChevronRight, Search, Bell } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface AdminShellProps {
    children: React.ReactNode
    userEmail?: string
}

export function AdminShell({ children, userEmail }: AdminShellProps) {
    const pathname = usePathname()
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    // Handle scroll effect for header
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/birds", label: "Koleksi Burung", icon: Bird }, // Changed from /admin/posts to /admin/birds
        { href: "/admin/leads", label: "Leads Customer", icon: Users },
        { href: "/admin/settings", label: "Pengaturan", icon: Settings },
    ]

    const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/")

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white/80 backdrop-blur-xl border-r border-gray-100/50 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.02)]">
            {/* Logo Area */}
            <div className="p-6 md:p-8 flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-900 to-emerald-800 rounded-xl flex items-center justify-center overflow-hidden shadow-lg shadow-emerald-900/20 ring-1 ring-emerald-900/10">
                    <Image src="/icon/icon.png" alt="Logo" width={40} height={40} className="w-full h-full object-contain p-1" />
                </div>
                <div>
                    <h2 className="font-serif font-bold text-xl text-gray-900 leading-none tracking-tight">NAF BIRD</h2>
                    <p className="text-[10px] text-emerald-600 uppercase tracking-[0.2em] font-bold mt-1">Admin Panel</p>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 px-4 md:px-6 space-y-2 py-6 overflow-y-auto">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-4">Main Menu</div>
                {navItems.map((item) => {
                    const active = isActive(item.href) && (item.href !== '/admin' || pathname === '/admin');
                    return (
                        <Link 
                            key={item.href} 
                            href={item.href}
                            onClick={() => setIsMobileOpen(false)}
                            className="block relative group"
                        >
                            {active && (
                                <motion.div 
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-white rounded-xl border border-emerald-100"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <div className={cn(
                                "relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors duration-200",
                                active ? "text-emerald-900" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/80"
                            )}>
                                <item.icon className={cn(
                                    "w-5 h-5 transition-colors duration-200", 
                                    active ? "text-emerald-600" : "text-gray-400 group-hover:text-gray-600"
                                )} />
                                {item.label}
                                {active && <ChevronRight className="w-4 h-4 ml-auto text-emerald-600" />}
                            </div>
                        </Link>
                    )
                })}
            </div>

            {/* Profile Footer */}
            <div className="p-6 border-t border-gray-100/50 bg-gray-50/30">
                <div className="flex items-center gap-3 mb-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <Avatar className="w-9 h-9 border-2 border-white ring-1 ring-gray-100 ring-offset-2">
                        <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold text-xs">
                            {userEmail ? userEmail[0].toUpperCase() : "A"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-bold text-gray-900 truncate">Administrator</p>
                        <p className="text-[10px] text-gray-400 truncate font-medium">{userEmail || "admin@nafbird.com"}</p>
                    </div>
                </div>
                <form action="/auth/signout" method="post">
                    <Button variant="ghost" size="sm" className="w-full justify-start text-gray-500 hover:text-red-600 hover:bg-red-50/50 gap-2 h-10 font-medium transition-all rounded-xl">
                        <LogOut className="w-4 h-4" /> Sign Out
                    </Button>
                </form>
            </div>
        </div>
    )

    return (
        <div className="flex min-h-screen bg-[#F8F9FA] text-gray-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-72 h-screen sticky top-0 z-30">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                        />
                        <motion.aside 
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 left-0 w-72 z-50 md:hidden bg-white shadow-2xl"
                        >
                            <SidebarContent />
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setIsMobileOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-0 min-w-0">
                {/* Header */}
                <header className={cn(
                    "h-20 sticky top-0 z-20 flex items-center justify-between px-4 md:px-8 transition-all duration-300",
                    scrolled ? "bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm" : "bg-transparent"
                )}>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="md:hidden -ml-2 hover:bg-gray-100/50" onClick={() => setIsMobileOpen(true)}>
                            <Menu className="w-6 h-6 text-gray-600" />
                        </Button>
                        <h1 className="text-xl md:text-2xl font-serif font-bold text-gray-900 hidden md:block">
                            {navItems.find(i => isActive(i.href))?.label || "Dashboard"}
                        </h1>
                        <h1 className="text-lg font-serif font-bold text-gray-900 md:hidden">
                           NAF Admin
                        </h1>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="hidden md:flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-emerald-100 transition-all w-64">
                            <Search className="w-4 h-4 text-gray-400 mr-2" />
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400" 
                            />
                        </div>
                        <Button variant="outline" size="icon" className="rounded-full bg-white border-gray-200 hover:bg-gray-50 text-gray-500 relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </Button>
                        <Button variant="default" className="bg-emerald-800 hover:bg-emerald-900 text-white rounded-full px-6 shadow-lg shadow-emerald-900/20" asChild>
                            <Link href="/">Check Website</Link>
                        </Button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="max-w-7xl mx-auto"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    )
}
