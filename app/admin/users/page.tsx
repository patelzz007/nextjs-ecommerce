"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, User } from "lucide-react"
import { AdminGuard } from "@/components/admin-guard"
import { useBreadcrumb } from "@/lib/breadcrumb-context"
import { useEffect } from "react"

const MOCK_USERS = [
  { id: "1", name: "Super Admin", email: "admin@store.com", role: "superadmin" as const, joinedAt: "2024-01-01" },
  { id: "2", name: "Merchant User", email: "merchant@store.com", role: "merchant" as const, joinedAt: "2024-01-15" },
  { id: "3", name: "Regular User", email: "user@store.com", role: "user" as const, joinedAt: "2024-02-01" },
]

export default function UsersPage() {
  const { setPageInfo } = useBreadcrumb()

  useEffect(() => {
    setPageInfo("Users", "Manage platform users and their roles")
  }, [setPageInfo])

  return (
    <AdminGuard allowedRoles={["superadmin"]}>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Users</h1>
          <p className="text-muted-foreground">Manage platform users and their roles</p>
        </div>

        <div className="grid gap-4">
          {MOCK_USERS.map((user) => (
            <Card key={user.id} className="border-2">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                      {user.role === "superadmin" ? <Shield className="h-6 w-6" /> : <User className="h-6 w-6" />}
                    </div>

                    <div>
                      <h3 className="font-bold text-lg mb-1">{user.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined: {new Date(user.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant={
                      user.role === "superadmin" ? "default" : user.role === "merchant" ? "secondary" : "outline"
                    }
                  >
                    {user.role}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminGuard>
  )
}
