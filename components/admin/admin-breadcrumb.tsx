"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { useBreadcrumb } from "@/lib/breadcrumb-context"
import { cn } from "@/lib/utils"

import {
  BarChart2,
  Building2,
  CreditCard,
  Folder,
  Users2,
  Shield,
  Settings,
  HelpCircle,
  FileText,
  PieChart,
  Award,
  User,
  Users,
  PlusCircle,
  LayoutDashboard,
  TrendingUp,
  Package,
  Truck,
  CheckCircle,
  Building,
  ShoppingCart,
  Box,
} from "lucide-react"

const iconMap: Record<string, any> = {
  Home,
  BarChart2,
  Building2,
  CreditCard,
  Folder,
  Users2,
  Shield,
  Settings,
  HelpCircle,
  FileText,
  PieChart,
  Award,
  User,
  Users,
  PlusCircle,
  LayoutDashboard,
  TrendingUp,
  Package,
  Truck,
  CheckCircle,
  Building,
  ShoppingCart,
  Box,
}

interface AdminBreadcrumbProps {
  className?: string
  showIcons?: boolean
  maxItems?: number
}

export function AdminBreadcrumb({ className, showIcons = true, maxItems = 5 }: AdminBreadcrumbProps) {
  const { breadcrumbs } = useBreadcrumb()

  if (!breadcrumbs || breadcrumbs.length === 0) {
    return null
  }

  const displayBreadcrumbs =
    breadcrumbs.length > maxItems
      ? [
          breadcrumbs[0], // Always show first item (Dashboard)
          { id: "ellipsis", title: "...", href: "#" },
          ...breadcrumbs.slice(-maxItems + 2), // Show last few items
        ]
      : breadcrumbs

  return (
    <nav className={cn("flex items-center space-x-1 text-sm text-foreground mb-6", className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {displayBreadcrumbs.map((item, index) => {
          const isLast = index === displayBreadcrumbs.length - 1
          const isEllipsis = item.id === "ellipsis"
          const IconComponent = showIcons && item.icon ? iconMap[item.icon] : null

          return (
            <li key={`${item.id}-${index}`} className="flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground mx-1 shrink-0" />}

              {isEllipsis ? (
                <span className="text-muted-foreground px-2">...</span>
              ) : isLast ? (
                <span className="flex items-center font-medium text-foreground">
                  {IconComponent && <IconComponent className="h-4 w-4 mr-1.5 shrink-0" />}
                  <span className="truncate max-w-[200px]">{item.title}</span>
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {IconComponent && <IconComponent className="h-4 w-4 mr-1.5 shrink-0" />}
                  <span className="truncate max-w-[150px]">{item.title}</span>
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export function AdminBreadcrumbCompact({ className }: { className?: string }) {
  const { breadcrumbs } = useBreadcrumb()

  if (!breadcrumbs || breadcrumbs.length === 0) {
    return null
  }

  const currentPage = breadcrumbs[breadcrumbs.length - 1]
  const parentPage = breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2] : null

  return (
    <nav className={cn("flex items-center space-x-1 text-sm", className)} aria-label="Breadcrumb">
      {parentPage && (
        <>
          <Link
            href={parentPage.href}
            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            {parentPage.title}
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </>
      )}
      <span className="font-medium text-foreground truncate">{currentPage.title}</span>
    </nav>
  )
}
