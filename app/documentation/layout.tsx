"use client"

import type React from "react"
import { Search, Github, Twitter, Menu, X, MoreVertical } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Suspense } from "react"
import { Inter, JetBrains_Mono } from "next/font/google"
import { useState } from "react"
import { DocSidebar } from "@/components/documentation/doc-sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })

export default function DocumentationLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isAdminApi = pathname?.includes("admin-api")

  return (
    <div className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen bg-slate-50 font-sans`}>
      {/* Desktop Header - only show on large screens (1280px+) */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 hidden xl:block">
        <div className="flex h-16 items-center justify-between px-6 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white text-sm">
                S
              </span>
              <span>STORE</span>
            </Link>

            <nav className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              <Link
                href="/documentation"
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  !isAdminApi
                    ? "text-white bg-indigo-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white"
                }`}
              >
                Store API
              </Link>
              <Link
                href="/documentation/admin-api"
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  isAdminApi
                    ? "text-white bg-indigo-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white"
                }`}
              >
                Admin API
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Suspense fallback={<div>Loading...</div>}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="search"
                  placeholder="Search documentation..."
                  className="w-80 bg-slate-50 border-slate-200 pl-10 pr-16 h-10 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-slate-300 bg-white px-1.5 font-mono text-xs text-slate-600 shadow-sm">
                  ⌘K
                </kbd>
              </div>
            </Suspense>
            <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
              <Link
                href="https://github.com"
                className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com"
                className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile/Tablet Header - show below large screens */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 xl:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-900">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white text-sm">
                S
              </span>
              <span>STORE</span>
            </Link>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="API Menu"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/documentation" className="cursor-pointer w-full">
                  <span className={!isAdminApi ? "font-semibold text-indigo-600" : ""}>Store API</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/documentation/admin-api" className="cursor-pointer w-full">
                  <span className={isAdminApi ? "font-semibold text-indigo-600" : ""}>Admin API</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile/Tablet Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto xl:hidden pt-16">
          <DocSidebar isMobileMenuOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        </div>
      )}

      {children}
    </div>
  )
}
