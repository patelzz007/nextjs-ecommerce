"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { Fragment } from "react"

export function Breadcrumb() {
  const pathname = usePathname()

  // Generate breadcrumb segments from pathname
  const segments = pathname.split("/").filter(Boolean)

  // Helper to format segment names
  const formatSegment = (segment: string) => {
    // Handle special cases
    const specialCases: Record<string, string> = {
      products: "Products",
      orders: "Orders",
      cart: "Cart",
      checkout: "Checkout",
      account: "Account",
    }

    if (specialCases[segment]) {
      return specialCases[segment]
    }

    // For IDs or other segments, capitalize first letter
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Build breadcrumb path
  const breadcrumbs = segments.map((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join("/")}`
    const label = formatSegment(segment)
    return { path, label }
  })

  // Don't show breadcrumb on homepage
  if (pathname === "/") {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
      <Link
        href="/"
        className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Home"
      >
        <Home className="w-4 h-4" />
      </Link>

      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1

        return (
          <Fragment key={crumb.path}>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            {isLast ? (
              <span className="font-medium text-foreground" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <Link href={crumb.path} className="text-muted-foreground hover:text-foreground transition-colors">
                {crumb.label}
              </Link>
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}
