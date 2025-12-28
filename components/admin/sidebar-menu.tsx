"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, ChevronDown } from "lucide-react"
import { useSidebar } from "@/stores/sidebar-store"
import {
  Home,
  Clock,
  CreditCard,
  FileText,
  TrendingUp,
  DollarSign,
  Folder,
  Shield,
  Building,
  Circle,
  Truck,
  Package,
  Users,
  User,
  HelpCircle,
  Settings,
  BarChart3,
} from "lucide-react"

// Icon mapping
const iconMap = {
  Home,
  Clock,
  CreditCard,
  FileText,
  TrendingUp,
  DollarSign,
  Folder,
  Shield,
  Building,
  Circle,
  Truck,
  Package,
  Users,
  User,
  HelpCircle,
  Settings,
  BarChart3,
}

interface MenuItem {
  title: string
  url: string
  icon?: string
  children?: MenuItem[]
  disabled: boolean
}

interface SidebarMenuItemProps {
  item: MenuItem
  level?: number
  sectionIndex?: number
  itemIndex?: number
}

export function SidebarMenuItem({ item, level = 0, sectionIndex = 0, itemIndex = 0 }: SidebarMenuItemProps) {
  const pathname = usePathname()
  const { isOpen } = useSidebar()
  const [isExpanded, setIsExpanded] = useState(false)

  const Icon = item.icon ? iconMap[item.icon as keyof typeof iconMap] : null
  const hasChildren = item.children && item.children.length > 0
  const isActive = pathname === item.url
  const isParentActive = item.children?.some((child) => isActiveRecursive(child, pathname))
  const isDisabled = item.disabled

  // Calculate indentation based on level
  const indentationClass = level === 0 ? "pl-3" : `pl-${Math.min(3 + level * 3, 12)}`

  const animationDelay = `calc(${sectionIndex} * var(--animation-delay-base) + ${itemIndex} * var(--animation-delay-item))`

  const handleToggle = (e: React.MouseEvent) => {
    if (hasChildren && !isDisabled) {
      e.preventDefault()
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <li>
      <div className="relative">
        {hasChildren ? (
          <button
            onClick={handleToggle}
            disabled={isDisabled}
            className={`w-full flex items-center gap-3 ${indentationClass} pr-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
              isActive || isParentActive
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                : isDisabled
                  ? "text-muted-foreground cursor-not-allowed opacity-50"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
            title={!isOpen ? item.title : isDisabled ? "This feature is currently unavailable" : undefined}
          >
            {/* Icon */}
            {Icon && level === 0 && (
              <Icon
                className="shrink-0"
                style={{ width: "var(--icon-size-sm)", height: "var(--icon-size-sm)" }}
                strokeWidth={2}
              />
            )}
            {!Icon && level > 0 && (
              <div
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  isActive || isParentActive ? "bg-sidebar-primary-foreground" : "bg-muted-foreground/50"
                }`}
              />
            )}

            {/* Title */}
            <span
              className="transition-all flex-1 text-left"
              style={{
                fontSize: "var(--text-size-sm)",
                transitionDuration: "var(--animation-duration-normal)",
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? "translateX(0)" : "translateX(-0.5rem)",
                transitionDelay: animationDelay,
              }}
            >
              {item.title}
            </span>

            {/* Chevron */}
            <div
              className="transition-all"
              style={{
                transitionDuration: "var(--animation-duration-normal)",
                opacity: isOpen ? 1 : 0,
                transitionDelay: animationDelay,
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 shrink-0" strokeWidth={2} />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0" strokeWidth={2} />
              )}
            </div>
          </button>
        ) : (
          <Link
            href={isDisabled ? "#" : item.url}
            onClick={(e) => {
              if (isDisabled) {
                e.preventDefault()
              }
            }}
            className={`flex items-center gap-3 ${indentationClass} pr-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
              isActive
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                : isDisabled
                  ? "text-muted-foreground cursor-not-allowed opacity-50"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
            title={!isOpen ? item.title : isDisabled ? "This feature is currently unavailable" : undefined}
          >
            {/* Icon */}
            {Icon && level === 0 && (
              <Icon
                className="shrink-0"
                style={{ width: "var(--icon-size-sm)", height: "var(--icon-size-sm)" }}
                strokeWidth={2}
              />
            )}
            {!Icon && level > 0 && (
              <div
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? "bg-sidebar-primary-foreground" : "bg-muted-foreground/50"}`}
              />
            )}

            {/* Title */}
            <span
              className="transition-all"
              style={{
                fontSize: "var(--text-size-sm)",
                transitionDuration: "var(--animation-duration-normal)",
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? "translateX(0)" : "translateX(-0.5rem)",
                transitionDelay: animationDelay,
              }}
            >
              {item.title}
            </span>
          </Link>
        )}

        {/* Vertical line for nested items */}
      </div>

      {/* Nested items */}
      {hasChildren && isExpanded && (
        <ul className={`mt-1 mb-1 space-y-0.5 ${isOpen ? "block" : "hidden"}`}>
          {item.children!.map((child, childIndex) => (
            <SidebarMenuItem
              key={child.title}
              item={child}
              level={level + 1}
              sectionIndex={sectionIndex}
              itemIndex={itemIndex + childIndex + 1}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

// Helper function to check if any nested item is active
function isActiveRecursive(item: MenuItem, pathname: string): boolean {
  if (item.url === pathname) return true
  if (item.children) {
    return item.children.some((child) => isActiveRecursive(child, pathname))
  }
  return false
}
