"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/components/auth-layout"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const success = await login(email, password)

    if (success) {
      window.location.href = "/"
    } else {
      setError("Invalid email or password")
    }

    setIsLoading(false)
  }

  return (
    <AuthLayout
      title="STORE"
      subtitle="Empowering businesses and customers with seamless rewards and referral solutions."
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="text-gray-600">Sign in to access your merchant dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-900">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@business.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 border-gray-200 focus:border-gray-900 focus:ring-gray-900"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-gray-900">
                Password
              </Label>
              <Link href="/forgot-password" className="text-sm text-gray-900 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 pr-10 border-gray-200 focus:border-gray-900 focus:ring-gray-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-11 bg-black hover:bg-gray-800 text-white font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-gray-900 font-medium hover:underline">
            Create one
          </Link>
        </div>

        {/* Demo Accounts */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-2">Demo Accounts:</p>
          <div className="space-y-1 text-xs text-gray-600">
            <p>
              <strong>Super Admin:</strong> admin@store.com / admin123
            </p>
            <p>
              <strong>Merchant:</strong> merchant@store.com / merchant123
            </p>
            <p>
              <strong>User:</strong> user@store.com / user123
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
