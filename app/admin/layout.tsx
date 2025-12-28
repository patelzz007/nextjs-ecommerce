"use client"

import type React from "react"
import { useState } from "react"
import { default as AdminSidebar } from "@/components/admin/sidebar"
import { Topbar } from "@/components/admin/topbar"
import { AdminGuard } from "@/components/admin-guard"
import { useSidebar } from "@/stores/sidebar-store"
import { cn } from "@/lib/utils"
import { BreadcrumbProvider } from "@/lib/breadcrumb-context"
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isOpen } = useSidebar()

  return (
    <AdminGuard>
      <BreadcrumbProvider>
        <div className="flex h-screen overflow-hidden bg-background">
          {/* Desktop Sidebar */}
          <aside
            className={cn("hidden lg:block border-r transition-all duration-300 ease-in-out", isOpen ? "w-76" : "w-0")}
          >
            {isOpen && (
              <AdminSidebar isMobileMenuOpen={false} setIsMobileMenuOpen={() => {}} isHighlightParentItem={true} />
            )}
          </aside>

          {/* Mobile Sidebar */}
          <aside
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-84 transform transition-transform duration-300 lg:hidden",
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <AdminSidebar
              isMobileMenuOpen={isMobileMenuOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
              isHighlightParentItem={true}
            />
          </aside>

          {/* Mobile Overlay */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Topbar setIsMobileMenuOpen={setIsMobileMenuOpen} />
            <main className="flex-1 overflow-y-auto bg-muted/20">
              <div className="container mx-auto p-6">
                <AdminBreadcrumb />
                {children}
              </div>
            </main>
          </div>
        </div>
      </BreadcrumbProvider>
    </AdminGuard>
  )
}
