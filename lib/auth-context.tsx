"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "superadmin" | "merchant" | "user"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demo
const MOCK_USERS: Record<string, User & { password: string }> = {
  "admin@store.com": {
    id: "1",
    email: "admin@store.com",
    name: "Super Admin",
    role: "superadmin",
    password: "admin123",
  },
  "merchant@store.com": {
    id: "2",
    email: "merchant@store.com",
    name: "Merchant User",
    role: "merchant",
    password: "merchant123",
  },
  "user@store.com": {
    id: "3",
    email: "user@store.com",
    name: "Regular User",
    role: "user",
    password: "user123",
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const mockUser = MOCK_USERS[email]
    if (mockUser && mockUser.password === password) {
      const { password: _, ...userWithoutPassword } = mockUser
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
