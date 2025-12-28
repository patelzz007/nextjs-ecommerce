"use client"

import { Bell, Menu, Search, Settings, ChevronDown } from "lucide-react"
import { useSidebar } from "@/stores/sidebar-store"
import { useState, useEffect } from "react"
import notificationData from "@/data/notification-data.json"
import { useAuth } from "@/lib/auth-context"
import { CommandPalette } from "./command-palette"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Profile01 from "./profile-01"
import { Button } from "@/components/ui/button"

interface TopNavProps {
  setIsMobileMenuOpen: (isOpen: boolean) => void
}

export function Topbar({ setIsMobileMenuOpen }: TopNavProps) {
  const { user } = useAuth()
  const { toggle, isOpen } = useSidebar()
  const [commandOpen, setCommandOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Count unread notifications
  const unreadCount = notificationData.notifications.filter((notification) => !notification.read).length

  // Check if we're on mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  return (
    <>
      <CommandPalette open={commandOpen} setOpen={setCommandOpen} />
      <div className="sticky top-0 z-40 h-16 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex h-full items-center justify-between px-4 lg:px-6 gap-4">
          {/* Left section */}
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden"
              aria-label="Toggle mobile menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Desktop sidebar toggle */}
            <Button variant="ghost" size="icon" onClick={toggle} className="hidden lg:flex" aria-label="Toggle sidebar">
              <Menu className="h-5 w-5" />
            </Button>

            {/* Brand/Title */}
            {!isOpen && (
              <div className="hidden lg:flex items-center">
                <h1 className="text-lg font-semibold tracking-tight">STORE Admin</h1>
              </div>
            )}
          </div>

          {/* Center section - Search */}
          <div className="flex-1 max-w-md hidden md:block">
            <button
              onClick={() => setCommandOpen(true)}
              className="relative w-full flex items-center h-9 px-3 rounded-lg border bg-muted/40 hover:bg-muted/60 transition-colors group"
            >
              <Search className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-sm text-muted-foreground flex-1 text-left">Search...</span>
              <div className="flex items-center gap-0.5">
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </button>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-1">
            {/* Mobile search button */}
            <Button variant="ghost" size="icon" onClick={() => setCommandOpen(true)} className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-red-500 hover:bg-red-500">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span className="font-semibold">Notifications</span>
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {unreadCount} new
                    </Badge>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[400px] overflow-y-auto">
                  {notificationData.notifications.slice(0, 5).map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="flex flex-col items-start p-3 space-y-1 cursor-pointer"
                    >
                      <div className="flex items-start justify-between w-full gap-2">
                        <span className="text-sm font-medium leading-tight">{notification.title}</span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {notification.message}
                      </p>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center justify-center cursor-pointer">
                  <span className="text-sm font-medium">View all notifications</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings */}
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Settings className="h-5 w-5" />
            </Button>

            {/* Divider */}
            <div className="hidden sm:block h-6 w-px bg-border mx-1" />

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2 h-9">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 text-white flex items-center justify-center text-xs font-semibold ring-2 ring-border">
                    {user?.name?.slice(0, 2).toUpperCase() || "U"}
                  </div>
                  <div className="hidden lg:flex flex-col items-start">
                    <span className="text-sm font-medium leading-none">{user?.name || "User"}</span>
                    <span className="text-xs text-muted-foreground leading-none mt-0.5 capitalize">
                      {user?.role || "user"}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground hidden lg:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="w-80 sm:w-96">
                <Profile01 />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  )
}
