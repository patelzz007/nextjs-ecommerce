"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import sidebarMenu from "@/data/admin-menu.json"
import { useSidebar } from "@/stores/sidebar-store" // Import from Zustand store instead of context
import { useAuth } from "@/lib/auth-context"
import { usePermissions } from "@/lib/permissions-context"
import { cn } from "@/lib/utils"

// Import all your icons
import {
  BarChart2,
  Receipt,
  Building2,
  CreditCard,
  Folder,
  Wallet,
  Users2,
  Shield,
  MessagesSquare,
  Video,
  Settings,
  HelpCircle,
  Home,
  Calendar,
  FileText,
  PieChart,
  Briefcase,
  Award,
  UserCheck,
  GitBranch,
  User,
  Users,
  MessageSquare,
  List,
  Plane,
  Clock,
  BookOpen,
  Bell,
  Share2,
  ClipboardCheck,
  GitMerge,
  DollarSign,
  GraduationCap,
  Heart,
  UserPlus,
  Clipboard,
  PlusSquare,
  Calculator,
  CheckSquare,
  Plus,
  PlusCircle,
  LayoutDashboard,
  Mail,
  Terminal,
  TrendingUp,
  Store,
  Package,
  ShoppingCart,
  Truck,
  CheckCircle,
  CheckCircle2,
  Warehouse,
  FolderOpen,
  ArrowUpRight,
  Tag,
  Layout,
  Building,
  Eye,
  Upload,
  AlertCircle,
  Brain,
  Zap,
  Bot,
  Cloud,
  ArrowDownToLine,
  ArrowUpFromLine,
  Play,
  FileBarChart,
  CalendarDays,
  CalendarRange,
  Monitor,
  Sliders,
  Circle,
  BarChart3,
} from "lucide-react"

// Icon mapping
const iconMap: Record<string, any> = {
  Home,
  BarChart2,
  BarChart3,
  Building2,
  Folder,
  Wallet,
  Receipt,
  CreditCard,
  Users2,
  Shield,
  MessagesSquare,
  Video,
  Settings,
  HelpCircle,
  Calendar,
  FileText,
  PieChart,
  Briefcase,
  Award,
  UserCheck,
  GitBranch,
  User,
  Users,
  MessageSquare,
  List,
  Plane,
  Clock,
  BookOpen,
  Bell,
  Share2,
  ClipboardCheck,
  GitMerge,
  DollarSign,
  GraduationCap,
  Heart,
  UserPlus,
  Clipboard,
  PlusSquare,
  Calculator,
  CheckSquare,
  Plus,
  PlusCircle,
  LayoutDashboard,
  Mail,
  Terminal,
  TrendingUp,
  Store,
  Package,
  ShoppingCart,
  Truck,
  CheckCircle,
  CheckCircle2,
  Warehouse,
  FolderOpen,
  ArrowUpRight,
  Tag,
  Layout,
  Building,
  Eye,
  Upload,
  AlertCircle,
  Brain,
  Zap,
  Bot,
  Cloud,
  ArrowDownToLine,
  ArrowUpFromLine,
  Play,
  FileBarChart,
  CalendarDays,
  CalendarRange,
  Monitor,
  Sliders,
  Circle,
}

interface SidebarProps {
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (isOpen: boolean) => void
  isHighlightParentItem?: boolean
}

// Define a type for menu items - icon is now required
interface MenuItem {
  title: string
  url: string
  icon?: string
  roles?: string[]
  permissions?: string[]
  children?: MenuItem[]
  disabled: boolean
}

// Define a type for menu sections
interface MenuSection {
  title: string
  items: MenuItem[]
}

export default function Sidebar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isHighlightParentItem = false,
}: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isOpen } = useSidebar()
  const { user } = useAuth()
  const { hasAnyPermission } = usePermissions()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [activeItems, setActiveItems] = useState<Record<string, boolean>>({})

  // Create a unique ID for each menu item based on its path
  const createItemId = (item: MenuItem, parentId = ""): string => {
    const id = item.title.toLowerCase().replace(/\s+/g, "-")
    return parentId ? `${parentId}-${id}` : id
  }

  // Check if a route is active (for parent items)
  const isRouteActive = (href: string): boolean => {
    if (href === "#") return false
    if (href === "/") return pathname === "/"
    // Check if the current path starts with the href (for nested routes)
    if (pathname.startsWith(href)) {
      // For parent routes, check if the next character is a slash
      // This prevents "/organization" from matching "/organizations"
      const nextChar = pathname.charAt(href.length)
      return nextChar === "" || nextChar === "/"
    }
    return false
  }

  // Find all active menu items and their parents
  const findActiveItems = () => {
    const expandedItems: Record<string, boolean> = {}
    const activeItems: Record<string, boolean> = {}

    // Function to recursively check items and their children
    const checkItem = (
      item: MenuItem,
      parentId = "",
      isRootLevel = false,
    ): { isActive: boolean; hasActiveChild: boolean } => {
      const currentId = createItemId(item, parentId)
      const hasChildren = item.children && item.children.length > 0

      // Check if this item's path exactly matches the current path
      const isExactMatch = pathname === item.url

      // For leaf nodes, we only care about exact matches
      // For parent nodes, we check if the current path starts with this item's path
      const isActive = hasChildren ? isRouteActive(item.url) : isExactMatch

      // If this item has children, check them
      let hasActiveChild = false
      if (hasChildren) {
        for (const child of item.children!) {
          const result = checkItem(child, currentId, false) // Child items are not root level
          if (result.isActive || result.hasActiveChild) {
            hasActiveChild = true
            // Always expand items with active children
            expandedItems[currentId] = true
          }
        }
      }
      // Determine if this item should be highlighted
      if (isHighlightParentItem) {
        // Highlight if it's an exact match OR if it's a root level item with active children
        if (isExactMatch || (isRootLevel && hasActiveChild)) {
          activeItems[currentId] = true
        }
      } else {
        // Only highlight if it's an exact match
        if (isExactMatch) {
          activeItems[currentId] = true
        }
      }

      return { isActive: isExactMatch, hasActiveChild }
    }

    // Check all sections - mark top-level items as root level
    sidebarMenu.sections.forEach((section: MenuSection) => {
      section.items.forEach((item) => {
        checkItem(item, "", true) // Top-level items are root level
      })
    })

    // Check footer items - mark as root level
    sidebarMenu.bottomItems.forEach((item) => {
      checkItem(item, "", true) // Footer items are root level
    })

    return { expandedItems, activeItems }
  }

  // Toggle expanded state for a menu item
  const toggleExpand = (itemId: string, e: React.MouseEvent, isDisabled?: boolean) => {
    if (isDisabled) return
    e.stopPropagation()
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }

  // Handle navigation and close mobile menu
  const handleNavigation = (href: string, e: React.MouseEvent, isDisabled?: boolean) => {
    if (isDisabled) return
    e.preventDefault()
    e.stopPropagation()

    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }

    if (href !== "#") {
      setTimeout(() => {
        router.push(href)
      }, 10)
    }
  }

  // Get icon component with fallback
  const getIconComponent = (iconName?: string) => {
    if (!iconName) return AlertCircle
    const IconComponent = iconMap[iconName]
    if (!IconComponent) {
      console.warn(`Icon "${iconName}" not found in iconMap. Using AlertCircle as fallback.`)
      return AlertCircle // Fallback icon to make missing icons obvious
    }
    return IconComponent
  }

  // Render a menu item and its children
  const renderMenuItem = (item: MenuItem, parentId = "", level = 0) => {
    const IconComponent = getIconComponent(item.icon)
    const hasChildren = item.children && item.children.length > 0
    const itemId = createItemId(item, parentId)
    const isExpanded = expandedItems[itemId] || false
    const isActive = activeItems[itemId] || false
    const isDisabled = item.disabled || !hasAccess(item)

    return (
      <div key={itemId} className="space-y-1">
        <div className="flex items-center">
          {hasChildren ? (
            // For items with children, use a button
            <button
              onClick={(e) => toggleExpand(itemId, e, isDisabled)}
              disabled={isDisabled}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md",
                "focus:outline-none transition-colors duration-200",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                  : isDisabled
                    ? "text-muted-foreground cursor-not-allowed opacity-50"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
              title={isDisabled ? "This feature is currently unavailable" : undefined}
            >
              <div className="flex items-center">
                <IconComponent
                  className={cn(
                    "h-4 w-4 mr-3 shrink-0",
                    isActive ? "text-sidebar-primary-foreground" : isDisabled ? "text-muted-foreground" : "",
                  )}
                />
                <span>{item.title}</span>
              </div>
              <div className="ml-2">
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-transform duration-200 ease-out",
                    isExpanded && "rotate-90",
                    isDisabled && "text-muted-foreground",
                  )}
                />
              </div>
            </button>
          ) : (
            // For items without children, use a button that navigates
            <button
              onClick={(e) => handleNavigation(item.url, e, isDisabled)}
              disabled={isDisabled}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md",
                "focus:outline-none transition-colors duration-200",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                  : isDisabled
                    ? "text-muted-foreground cursor-not-allowed opacity-50"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
              title={isDisabled ? "This feature is currently unavailable" : undefined}
            >
              <div className="flex items-center">
                <IconComponent
                  className={cn(
                    "h-4 w-4 mr-3 shrink-0",
                    isActive ? "text-sidebar-primary-foreground" : isDisabled ? "text-muted-foreground" : "",
                  )}
                />
                <span>{item.title}</span>
              </div>
            </button>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div
            className={cn(
              "border-l border-sidebar-border ml-5 pl-2",
              "transition-all duration-300 ease-in-out",
              isExpanded ? "max-h-250 opacity-100" : "max-h-0 opacity-0 overflow-hidden",
            )}
          >
            {item.children?.map((childItem) => renderMenuItem(childItem, itemId, level + 1))}
          </div>
        )}
      </div>
    )
  }

  const hasAccess = (item: MenuItem): boolean => {
    if (!user) return false

    // Check role-based access
    if (item.roles && item.roles.length > 0) {
      if (!item.roles.includes(user.role)) {
        return false
      }
    }

    // Check permission-based access
    if (item.permissions && item.permissions.length > 0) {
      if (!hasAnyPermission(item.permissions as any[])) {
        return false
      }
    }

    return true
  }

  const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
    if (!items || !Array.isArray(items)) {
      return []
    }
    return items
      .filter((item) => hasAccess(item))
      .map((item) => ({
        ...item,
        children: item.children ? filterMenuItems(item.children) : undefined,
      }))
  }

  const filteredSections = (sidebarMenu?.sections || [])
    .map((section) => ({
      ...section,
      items: filterMenuItems(section.items || []),
    }))
    .filter((section) => section.items.length > 0)

  const filteredBottomItems = filterMenuItems(sidebarMenu?.bottomItems || [])

  // Update expanded items when pathname changes
  useEffect(() => {
    if (user) {
      const { expandedItems, activeItems } = findActiveItems()
      setExpandedItems(expandedItems)
      setActiveItems(activeItems)
    }
  }, [pathname, isHighlightParentItem, user])

  // Show loading or empty state if no user
  if (!user) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <div className="text-gray-500 dark:text-gray-400 text-sm">Loading...</div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col sidebar-container bg-sidebar">
      <div className="h-16 px-6 flex justify-center items-center border-b border-sidebar-border">
        <div className="flex justify-center items-center gap-3">
          <div className="flex flex-col">
            <span className="text-lg font-semibold hover:cursor-pointer text-sidebar-foreground">
              {sidebarMenu?.header?.title || "STORE"}
            </span>
            <span className="text-xs text-muted-foreground">{sidebarMenu?.header?.subtitle || "Admin Portal"}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-4 sidebar-scroll">
        <div className="space-y-6 sidebar-nav-items">
          {filteredSections.map((section) => (
            <div key={section.title}>
              <div className="px-3 mb-2 text-xs font-medium uppercase text-sidebar-foreground/60">{section.title}</div>
              <div className="space-y-1">{section.items.map((item) => renderMenuItem(item))}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 border-t border-sidebar-border">
        <div className="space-y-1">{filteredBottomItems.map((item) => renderMenuItem(item))}</div>
      </div>
    </div>
  )
}
