"use client"

import type React from "react"

import { createContext, useContext } from "react"
import { useAuth, type UserRole } from "./auth-context"

type Permission =
  | "view_dashboard"
  | "manage_products"
  | "manage_orders"
  | "manage_users"
  | "view_analytics"
  | "manage_settings"

interface PermissionsContextType {
  hasPermission: (permission: Permission) => boolean
  hasAnyPermission: (permissions: Permission[]) => boolean
  hasAllPermissions: (permissions: Permission[]) => boolean
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined)

// Define permissions for each role
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  superadmin: [
    "view_dashboard",
    "manage_products",
    "manage_orders",
    "manage_users",
    "view_analytics",
    "manage_settings",
  ],
  merchant: ["view_dashboard", "manage_products", "manage_orders", "view_analytics"],
  user: ["view_dashboard"],
}

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false
    const userPermissions = ROLE_PERMISSIONS[user.role] || []
    return userPermissions.includes(permission)
  }

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (!user) return false
    return permissions.some((permission) => hasPermission(permission))
  }

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    if (!user) return false
    return permissions.every((permission) => hasPermission(permission))
  }

  return (
    <PermissionsContext.Provider value={{ hasPermission, hasAnyPermission, hasAllPermissions }}>
      {children}
    </PermissionsContext.Provider>
  )
}

export function usePermissions() {
  const context = useContext(PermissionsContext)
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionsProvider")
  }
  return context
}
