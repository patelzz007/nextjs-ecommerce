"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Search, ChevronDown, ChevronUp, BookOpen, X } from "lucide-react"
import { Input } from "@/components/ui/input"

const storeApiNavigation = [
  {
    title: "",
    items: [
      { title: "Introduction", href: "/documentation" },
      { title: "Authentication", href: "/documentation/authentication" },
      { title: "HTTP Compression", href: "/documentation/http-compression" },
      { title: "Publishable API Key", href: "/documentation/publishable-api-key" },
      { title: "Expanding Fields", href: "/documentation/expanding-fields" },
      { title: "Selecting Fields", href: "/documentation/selecting-fields" },
      { title: "Query Parameter Types", href: "/documentation/query-parameter-types" },
      { title: "Pagination", href: "/documentation/pagination" },
    ],
  },
  {
    title: "Products",
    collapsible: true,
    items: [
      { title: "List Products", href: "/documentation/products-list", method: "GET" },
      { title: "Get a Product", href: "/documentation/products-get", method: "GET" },
      { title: "Search Products", href: "/documentation/products-search", method: "POST" },
    ],
  },
  {
    title: "Carts",
    collapsible: true,
    items: [
      { title: "Create a Cart", href: "/documentation/carts-create", method: "POST" },
      { title: "Get a Cart", href: "/documentation/carts-get", method: "GET" },
      { title: "Update a Cart", href: "/documentation/carts-update", method: "POST" },
      { title: "Complete a Cart", href: "/documentation/carts-complete", method: "POST" },
    ],
  },
  {
    title: "Customers",
    collapsible: true,
    items: [
      { title: "Create Customer", href: "/documentation/customers-create", method: "POST" },
      { title: "Get Customer", href: "/documentation/customers-get", method: "GET" },
      { title: "Update Customer", href: "/documentation/customers-update", method: "POST" },
    ],
  },
  {
    title: "Orders",
    collapsible: true,
    items: [
      { title: "List Orders", href: "/documentation/orders-list", method: "GET" },
      { title: "Get an Order", href: "/documentation/orders-get", method: "GET" },
    ],
  },
  {
    title: "Payment",
    collapsible: true,
    items: [
      { title: "List Payment Providers", href: "/documentation/payment-providers-list", method: "GET" },
      { title: "Create Payment Session", href: "/documentation/payment-session-create", method: "POST" },
    ],
  },
]

const adminApiNavigation = [
  {
    title: "",
    items: [
      { title: "Admin API Overview", href: "/documentation/admin-api" },
      { title: "Authentication", href: "/documentation/admin-authentication" },
      { title: "Authorization", href: "/documentation/admin-authorization" },
      { title: "API Conventions", href: "/documentation/admin-conventions" },
    ],
  },
  {
    title: "Products",
    collapsible: true,
    items: [
      { title: "List Products", href: "/documentation/admin-products-list", method: "GET" },
      { title: "Create Product", href: "/documentation/admin-products-create", method: "POST" },
      { title: "Update Product", href: "/documentation/admin-products-update", method: "PUT" },
      { title: "Delete Product", href: "/documentation/admin-products-delete", method: "DELETE" },
    ],
  },
  {
    title: "Orders",
    collapsible: true,
    items: [
      { title: "List Orders", href: "/documentation/admin-orders-list", method: "GET" },
      { title: "Get an Order", href: "/documentation/admin-orders-get", method: "GET" },
      { title: "Update Order", href: "/documentation/admin-orders-update", method: "PUT" },
      { title: "Cancel Order", href: "/documentation/admin-orders-cancel", method: "POST" },
      { title: "Create Fulfillment", href: "/documentation/admin-fulfillment-create", method: "POST" },
    ],
  },
  {
    title: "Customers",
    collapsible: true,
    items: [
      { title: "List Customers", href: "/documentation/admin-customers-list", method: "GET" },
      { title: "Get a Customer", href: "/documentation/admin-customers-get", method: "GET" },
      { title: "Update Customer", href: "/documentation/admin-customers-update", method: "PUT" },
      { title: "Delete Customer", href: "/documentation/admin-customers-delete", method: "DELETE" },
    ],
  },
  {
    title: "Inventory",
    collapsible: true,
    items: [
      { title: "List Inventory Items", href: "/documentation/admin-inventory-list", method: "GET" },
      { title: "Update Inventory", href: "/documentation/admin-inventory-update", method: "PUT" },
      { title: "Adjust Stock Levels", href: "/documentation/admin-stock-adjust", method: "POST" },
    ],
  },
  {
    title: "Discounts",
    collapsible: true,
    items: [
      { title: "List Discounts", href: "/documentation/admin-discounts-list", method: "GET" },
      { title: "Create Discount", href: "/documentation/admin-discounts-create", method: "POST" },
      { title: "Update Discount", href: "/documentation/admin-discounts-update", method: "PUT" },
      { title: "Delete Discount", href: "/documentation/admin-discounts-delete", method: "DELETE" },
    ],
  },
  {
    title: "Users & Permissions",
    collapsible: true,
    items: [
      { title: "List Users", href: "/documentation/admin-users-list", method: "GET" },
      { title: "Create User", href: "/documentation/admin-users-create", method: "POST" },
      { title: "Update User Roles", href: "/documentation/admin-users-roles", method: "PUT" },
      { title: "Delete User", href: "/documentation/admin-users-delete", method: "DELETE" },
    ],
  },
]

function CollapsibleSection({ section, pathname, onClose }: { section: any; pathname: string; onClose?: () => void }) {
  const [isOpen, setIsOpen] = useState(true)

  if (!section.collapsible) {
    return (
      <div className="mb-6">
        {section.title && (
          <h3 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">{section.title}</h3>
        )}
        <ul className="space-y-1">
          {section.items.map((item: any) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 text-sm transition-colors rounded-md",
                    isActive
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                  )}
                >
                  <span>{item.title}</span>
                  {item.method && (
                    <span
                      className={cn(
                        "text-xs font-semibold px-2 py-0.5 rounded",
                        item.method === "GET" && "bg-green-100 text-green-700",
                        item.method === "POST" && "bg-blue-100 text-blue-700",
                        item.method === "PUT" && "bg-orange-100 text-orange-700",
                        item.method === "DELETE" && "bg-red-100 text-red-700",
                      )}
                    >
                      {item.method}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-3 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors rounded-md hover:bg-slate-100"
      >
        <span>{section.title}</span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {isOpen && (
        <ul className="mt-1 space-y-1 ml-4 pl-3 border-l border-slate-200">
          {section.items.map((item: any) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 text-sm transition-colors rounded-md",
                    isActive
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                  )}
                >
                  <span>{item.title}</span>
                  {item.method && (
                    <span
                      className={cn(
                        "text-xs font-semibold px-2 py-0.5 rounded",
                        item.method === "GET" && "bg-green-100 text-green-700",
                        item.method === "POST" && "bg-blue-100 text-blue-700",
                        item.method === "PUT" && "bg-orange-100 text-orange-700",
                        item.method === "DELETE" && "bg-red-100 text-red-700",
                      )}
                    >
                      {item.method}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export function DocSidebar({ isMobileMenuOpen, onClose }: { isMobileMenuOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname()
  const isAdminApi = pathname?.includes("admin-api") || pathname?.includes("admin-")
  const navigation = isAdminApi ? adminApiNavigation : storeApiNavigation

  return (
    <>
      {/* Desktop Sidebar - only show on large screens (1280px+) */}
      <aside className="hidden xl:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 overflow-y-auto border-r border-slate-200 bg-white p-6">
        <nav className="space-y-6">
          {navigation.map((section, idx) => (
            <div key={idx}>
              {section.title && (
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">{section.title}</h3>
              )}
              {section.collapsible ? (
                <CollapsibleSection section={section} pathname={pathname} />
              ) : (
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                            isActive
                              ? "bg-blue-50 text-blue-700 font-medium"
                              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                          )}
                        >
                          <span>{item.title}</span>
                          {item.method && (
                            <span
                              className={cn(
                                "text-xs font-semibold px-2 py-0.5 rounded",
                                item.method === "GET" && "bg-green-100 text-green-700",
                                item.method === "POST" && "bg-blue-100 text-blue-700",
                                item.method === "PUT" && "bg-orange-100 text-orange-700",
                                item.method === "DELETE" && "bg-red-100 text-red-700",
                              )}
                            >
                              {item.method}
                            </span>
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile/Tablet Sidebar Overlay - show below large screens */}
      {isMobileMenuOpen && (
        <>
          <div
            className="xl:hidden fixed inset-0 backdrop-blur-md z-[59] transition-all duration-300"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.01)" }}
            onClick={onClose}
          />

          <div className="xl:hidden fixed inset-y-0 left-0 w-[80%] max-w-sm bg-white/95 backdrop-blur-xl border-r border-slate-200/80 shadow-2xl z-[60] overflow-hidden flex flex-col">
            <div className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-white" />
                  <h2 className="text-lg font-semibold text-white">{isAdminApi ? "Admin API" : "Store API"}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="search"
                  placeholder="Search documentation..."
                  className="w-full bg-slate-50 border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-lg shadow-sm"
                />
              </div>

              <div className="border-t border-slate-200 mb-4" />

              <nav className="space-y-4">
                {navigation.map((section, idx) => (
                  <CollapsibleSection key={idx} section={section} pathname={pathname} onClose={onClose} />
                ))}
              </nav>
            </div>

            <div className="flex-shrink-0 border-t border-slate-200 bg-gradient-to-t from-slate-50 to-white px-4 py-3">
              <p className="text-xs text-slate-500 text-center">API Documentation v1.0</p>
            </div>
          </div>
        </>
      )}
    </>
  )
}
