"use client"

import { StatsCard } from "@/components/stats-card"
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react"
import { useProducts } from "@/lib/products-context"
import { useAuth } from "@/lib/auth-context"
import { MOCK_ORDERS } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useBreadcrumb } from "@/lib/breadcrumb-context"
import { useEffect } from "react"

export default function AdminDashboard() {
  const { products } = useProducts()
  const { user } = useAuth()
  const { setPageInfo } = useBreadcrumb()

  const totalProducts = products.length
  const totalOrders = MOCK_ORDERS.length
  const totalRevenue = MOCK_ORDERS.reduce((sum, order) => sum + order.total, 0)
  const lowStockProducts = products.filter((p) => p.stock < 20).length

  useEffect(() => {
    setPageInfo(
      `Welcome back, ${user?.role === "superadmin" ? "Super Admin" : user?.role === "merchant" ? "Merchant" : "User"}`,
      "Here's an overview of your e-commerce activities",
    )
  }, [user, setPageInfo])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.role === "superadmin" ? "Super Admin" : user?.role === "merchant" ? "Merchant" : "User"}
        </h1>
        <p className="text-muted-foreground">{"Here's an overview of your e-commerce activities"}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Active Orders"
          value={totalOrders}
          icon={ShoppingCart}
          trend={{ value: 3, isPositive: true }}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Low Stock Items"
          value={lowStockProducts}
          icon={TrendingUp}
          trend={{ value: 2, isPositive: false }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_ORDERS.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between pb-4 border-b last:border-0">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.userEmail}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${order.total.toFixed(2)}</p>
                    <Badge
                      variant={
                        order.status === "delivered" ? "default" : order.status === "shipped" ? "secondary" : "outline"
                      }
                      className="text-xs"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Low Stock Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products
                .filter((p) => p.stock < 20)
                .slice(0, 5)
                .map((product) => (
                  <div key={product.id} className="flex items-center justify-between pb-4 border-b last:border-0">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <Badge variant="destructive">{product.stock} left</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
