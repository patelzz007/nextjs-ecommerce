"use client"

import type { ReactNode } from "react"
import { StoreHeader } from "@/components/store-header"
import { BackgroundRippleEffect } from "@/components/background-ripple-effect"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export interface HeroButton {
  label: string
  icon?: LucideIcon
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary"
  onClick?: () => void
  href?: string
}

export interface HeroBadge {
  icon?: LucideIcon
  text: string
}

export interface StoreLayoutProps {
  children: ReactNode
  showHero?: boolean
  heroTitle?: string
  heroDescription?: string
  heroBadge?: HeroBadge
  heroButtons?: HeroButton[]
  heroHeight?: string
  className?: string
  showBreadcrumb?: boolean
}

export function StoreLayout({
  children,
  showHero = true,
  heroTitle,
  heroDescription,
  heroBadge,
  heroButtons = [],
  heroHeight = "h-[75vh]",
  className = "",
  showBreadcrumb = true,
}: StoreLayoutProps) {
  return (
    <div className={`min-h-screen bg-white ${className}`}>
      <StoreHeader />

      {showHero && (
        <section className={`relative ${heroHeight} flex items-center justify-center overflow-hidden bg-[#191D24]`}>
          <div className="absolute inset-0 z-0">
            <BackgroundRippleEffect />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
            {heroBadge && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full backdrop-blur-sm">
                {heroBadge.icon && <heroBadge.icon className="w-4 h-4 text-cyan-400" />}
                <span className="text-sm text-white/90">{heroBadge.text}</span>
              </div>
            )}

            {heroTitle && <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">{heroTitle}</h1>}

            {heroDescription && (
              <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">{heroDescription}</p>
            )}

            {heroButtons.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                {heroButtons.map((button, index) => {
                  const ButtonIcon = button.icon
                  return (
                    <Button
                      key={index}
                      size="lg"
                      variant={button.variant || "default"}
                      onClick={button.onClick}
                      className={
                        button.variant === "outline"
                          ? "bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/50"
                          : "bg-white text-black hover:bg-gray-100"
                      }
                    >
                      {ButtonIcon && <ButtonIcon className="w-5 h-5 mr-2" />}
                      {button.label}
                    </Button>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {showBreadcrumb && (
        <div className={`bg-white border-b ${!showHero ? "pt-24 md:pt-24" : ""}`}>
          <div className="container mx-auto px-4 py-3">
            <Breadcrumb />
          </div>
        </div>
      )}

      <main className={`bg-white ${!showHero ? "pt-0" : ""}`}>{children}</main>
    </div>
  )
}
