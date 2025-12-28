"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Store } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function AdminSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      roles: ["superadmin", "merchant"],
    },
    {
      title: "Products",
      href: "/admin/products",
      icon: Package,
      roles: ["superadmin", "merchant"],
    },
    {
      title: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
      roles: ["superadmin", "merchant"],
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
      roles: ["superadmin"],
    },
  ]

  const filteredNavItems = navItems.filter((item) => item.roles.includes(user?.role || ""))

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      <div className="p-6 border-b border-sidebar-border">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <p className="text-sm text-sidebar-foreground/60 mt-1">{user?.role}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {filteredNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Button asChild variant="outline" className="w-full justify-start gap-2 bg-transparent">
          <Link href="/">
            <Store className="h-4 w-4" />
            Back to Store
          </Link>
        </Button>
        <Button onClick={logout} variant="outline" className="w-full justify-start gap-2 bg-transparent">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
