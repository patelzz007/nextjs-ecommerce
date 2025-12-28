"use client"

import type React from "react"

import { useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

interface AdminGuardProps {
  children: React.ReactNode
  allowedRoles?: ("superadmin" | "merchant" | "user")[]
}

export function AdminGuard({ children, allowedRoles = ["superadmin", "merchant"] }: AdminGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login")
      } else if (!allowedRoles.includes(user.role)) {
        router.push("/")
      }
    }
  }, [user, isLoading, router, allowedRoles])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}
