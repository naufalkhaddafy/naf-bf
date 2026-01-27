"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CollectionPaginationProps {
    currentPage: number
    totalPages: number
}

export function CollectionPagination({ currentPage, totalPages }: CollectionPaginationProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    if (totalPages <= 1) return null

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        if (page === 1) {
            params.delete('page')
        } else {
            params.set('page', page.toString())
        }
        router.push(`${pathname}?${params.toString()}`)
    }

    const renderPageButtons = () => {
        const buttons = []
        const maxVisible = 5
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
        let end = Math.min(totalPages, start + maxVisible - 1)

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1)
        }

        for (let i = start; i <= end; i++) {
            buttons.push(
                <Button
                    key={i}
                    variant={currentPage === i ? "default" : "ghost"}
                    size="sm"
                    className={`h-10 w-10 rounded-xl font-bold transition-all duration-300 ${
                        currentPage === i 
                        ? "bg-emerald-800 hover:bg-emerald-900 text-white shadow-lg shadow-emerald-900/20" 
                        : "text-gray-500 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </Button>
            )
        }
        return buttons
    }

    return (
        <div className="mt-16 flex justify-center pb-10">
            <nav className="flex items-center p-1.5 bg-white rounded-2xl shadow-xl shadow-emerald-900/5 border border-gray-100 gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    disabled={currentPage === 1}
                    className="rounded-xl h-10 w-10 text-gray-400 disabled:opacity-30 hover:bg-emerald-50 hover:text-emerald-700"
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    <ChevronLeft className="w-5 h-5" />
                </Button>

                {renderPageButtons()}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                        <div className="w-10 h-10 flex items-center justify-center text-gray-300">
                            <span className="text-xl">...</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-10 w-10 rounded-xl text-gray-500 hover:bg-emerald-50 hover:text-emerald-700 font-medium"
                            onClick={() => handlePageChange(totalPages)}
                        >
                            {totalPages}
                        </Button>
                    </>
                )}

                <Button
                    variant="ghost"
                    size="sm"
                    disabled={currentPage === totalPages}
                    className="h-10 w-10 rounded-xl text-emerald-800 hover:bg-emerald-50 hover:text-emerald-700"
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    <ChevronRight className="w-5 h-5" />
                </Button>
            </nav>
        </div>
    )
}
