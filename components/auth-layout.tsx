import type React from "react"
import { Gift } from "lucide-react"
import { BackgroundRippleEffect } from "./background-ripple-effect"

interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export function AuthLayout({ children, title = "STORE", subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#191D24] text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <BackgroundRippleEffect />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex items-center justify-center w-full h-full p-12">
          <div className="max-w-md space-y-8 flex flex-col items-center text-center">
            {/* Brand Icon */}
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 bg-blue-600 rounded-2xl flex items-center justify-center">
                <Gift className="w-12 h-12 text-white" strokeWidth={2} />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full animate-pulse" />
            </div>

            {/* Brand Name */}
            <h1 className="text-5xl font-bold tracking-tight">{title}</h1>

            {/* Tagline */}
            {subtitle && <p className="text-lg text-gray-400 leading-relaxed">{subtitle}</p>}

            {/* Feature List */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />
                <p className="text-gray-300">Instant reward redemption</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />
                <p className="text-gray-300">QR code-based verification</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />
                <p className="text-gray-300">Secure & transparent tracking</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
