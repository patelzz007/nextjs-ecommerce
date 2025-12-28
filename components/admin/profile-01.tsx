"use client"

import { User, Settings, LogOut, CreditCard, Bell, UserCog } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function Profile01() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email
      ? user.email.split("@")[0].slice(0, 2).toUpperCase()
      : "U"

  return (
    <div className="w-full p-4">
      {/* User Info */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-12 w-12 border-2">
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{user?.name || user?.email}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          <p className="text-xs text-muted-foreground capitalize mt-1">
            Role: <span className="font-medium">{user?.role}</span>
          </p>
        </div>
      </div>

      <Separator className="my-3" />

      {/* Menu Items */}
      <div className="space-y-1">
        <button
          onClick={() => router.push("/account")}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
        >
          <UserCog className="h-4 w-4" />
          <span>Account Settings</span>
        </button>
        <button
          onClick={() => router.push("/admin/profile")}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
        >
          <User className="h-4 w-4" />
          <span>Profile</span>
        </button>
        <button
          onClick={() => router.push("/admin/settings")}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
        <button
          onClick={() => router.push("/admin/billing")}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
        >
          <CreditCard className="h-4 w-4" />
          <span>Billing</span>
        </button>
        <button
          onClick={() => router.push("/admin/notifications")}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
        >
          <Bell className="h-4 w-4" />
          <span>Notifications</span>
        </button>
      </div>

      <Separator className="my-3" />

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-destructive/10 text-destructive transition-colors"
      >
        <LogOut className="h-4 w-4" />
        <span>Log out</span>
      </button>
    </div>
  )
}
