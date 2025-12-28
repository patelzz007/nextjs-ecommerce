"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useOrders } from "@/lib/orders-context"
import { useAuth } from "@/lib/auth-context"
import { StoreLayout } from "@/components/store-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Store, MessageCircle, Package, ChevronDown } from "lucide-react"
import type { Order } from "@/lib/mock-data"

export default function OrdersPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { getUserOrders } = useOrders()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState<string>("all")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      const userOrders = getUserOrders()
      setOrders(userOrders)
      setFilteredOrders(userOrders)
    }
  }, [user, getUserOrders])

  useEffect(() => {
    let result = orders

    if (activeTab === "to-pay") {
      result = result.filter((order) => order.status === "pending")
    } else if (activeTab === "to-ship") {
      result = result.filter((order) => order.status === "processing")
    } else if (activeTab === "to-receive") {
      result = result.filter((order) => order.status === "shipped")
    } else if (activeTab === "completed") {
      result = result.filter((order) => order.status === "delivered")
    } else if (activeTab === "cancelled") {
      result = result.filter((order) => order.status === "cancelled")
    } else if (activeTab === "return-refund") {
      // For now, no return/refund status in our data model
      result = []
    }

    setFilteredOrders(result)
  }, [orders, activeTab])

  const getCounts = () => {
    return {
      all: orders.length,
      toPay: orders.filter((o) => o.status === "pending").length,
      toShip: orders.filter((o) => o.status === "processing").length,
      toReceive: orders.filter((o) => o.status === "shipped").length,
      completed: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
      returnRefund: 0,
    }
  }

  const counts = getCounts()

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return { label: "TO PAY", className: "bg-red-500 text-white hover:bg-red-600" }
      case "processing":
        return { label: "PROCESSING", className: "bg-blue-500 text-white hover:bg-blue-600" }
      case "shipped":
        return { label: "SHIPPED", className: "bg-purple-500 text-white hover:bg-purple-600" }
      case "delivered":
        return { label: "COMPLETED", className: "bg-green-500 text-white hover:bg-green-600" }
      case "cancelled":
        return { label: "CANCELLED", className: "bg-gray-500 text-white hover:bg-gray-600" }
      default:
        return { label: status.toUpperCase(), className: "bg-gray-500 text-white" }
    }
  }

  const getDeliveryMessage = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return { text: "Parcel has been delivered", icon: "✓" }
      case "shipped":
        return { text: "Parcel is on the way", icon: "🚚" }
      case "processing":
        return { text: "Order is being prepared", icon: "📦" }
      case "pending":
        return { text: "Payment pending", icon: "💳" }
      case "cancelled":
        return { text: "Order has been cancelled", icon: "✕" }
      default:
        return { text: "Order status unknown", icon: "?" }
    }
  }

  const getActionButtons = (order: Order) => {
    switch (order.status) {
      case "pending":
        return (
          <>
            <Button variant="destructive" className="flex-1">
              Pay Now
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Cancel Order
            </Button>
            <Button variant="ghost" size="icon">
              <ChevronDown className="w-4 h-4" />
            </Button>
          </>
        )
      case "processing":
        return (
          <>
            <Button variant="outline" className="flex-1 bg-transparent">
              Contact Seller
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Cancel Order
            </Button>
            <Button variant="ghost" size="icon">
              <ChevronDown className="w-4 h-4" />
            </Button>
          </>
        )
      case "shipped":
        return (
          <>
            <Button asChild variant="outline" className="flex-1 bg-transparent">
              <Link href={`/orders/${order.id}`}>Track Order</Link>
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Contact Seller
            </Button>
            <Button variant="ghost" size="icon">
              <ChevronDown className="w-4 h-4" />
            </Button>
          </>
        )
      case "delivered":
        return (
          <>
            <Button variant="default" className="flex-1 bg-slate-900 hover:bg-slate-800">
              Rate Products
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Request Return/Refund
            </Button>
            <Button variant="ghost" size="icon">
              <ChevronDown className="w-4 h-4" />
            </Button>
          </>
        )
      case "cancelled":
        return (
          <>
            <Button variant="default" className="flex-1 bg-slate-900 hover:bg-slate-800">
              Buy Again
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Contact Support
            </Button>
            <Button variant="ghost" size="icon">
              <ChevronDown className="w-4 h-4" />
            </Button>
          </>
        )
      default:
        return (
          <Button variant="outline" className="flex-1 bg-transparent">
            View Details
          </Button>
        )
    }
  }

  const getContextualText = (status: Order["status"]) => {
    const today = new Date()
    const futureDate = new Date(today)
    futureDate.setDate(today.getDate() + 7)
    const dateStr = futureDate.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })

    switch (status) {
      case "delivered":
        return `Rate products by ${dateStr}`
      case "shipped":
        return `Expected delivery by ${dateStr}`
      case "processing":
        return "Your order is being prepared for shipment"
      case "pending":
        return "Complete payment to proceed with your order"
      case "cancelled":
        return "Order was cancelled"
      default:
        return ""
    }
  }

  if (isLoading) {
    return (
      <StoreLayout showHero={false} showBreadcrumb={false}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </StoreLayout>
    )
  }

  if (!user) return null

  return (
    <StoreLayout
      showHero={true}
      showBreadcrumb={true}
      heroHeight="h-[30vh]"
      heroTitle="My Orders"
      heroDescription="Track and manage all your orders"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={activeTab === "all" ? "default" : "outline"}
            onClick={() => setActiveTab("all")}
            className={activeTab === "all" ? "bg-slate-900 hover:bg-slate-800" : "bg-transparent"}
          >
            All
            <Badge variant="secondary" className="ml-2">
              {counts.all}
            </Badge>
          </Button>
          <Button
            variant={activeTab === "to-pay" ? "default" : "outline"}
            onClick={() => setActiveTab("to-pay")}
            className={activeTab === "to-pay" ? "bg-slate-900 hover:bg-slate-800" : "bg-transparent"}
          >
            To Pay
            <Badge variant="secondary" className="ml-2">
              {counts.toPay}
            </Badge>
          </Button>
          <Button
            variant={activeTab === "to-ship" ? "default" : "outline"}
            onClick={() => setActiveTab("to-ship")}
            className={activeTab === "to-ship" ? "bg-slate-900 hover:bg-slate-800" : "bg-transparent"}
          >
            To Ship
            <Badge variant="secondary" className="ml-2">
              {counts.toShip}
            </Badge>
          </Button>
          <Button
            variant={activeTab === "to-receive" ? "default" : "outline"}
            onClick={() => setActiveTab("to-receive")}
            className={activeTab === "to-receive" ? "bg-slate-900 hover:bg-slate-800" : "bg-transparent"}
          >
            To Receive
            <Badge variant="secondary" className="ml-2">
              {counts.toReceive}
            </Badge>
          </Button>
          <Button
            variant={activeTab === "completed" ? "default" : "outline"}
            onClick={() => setActiveTab("completed")}
            className={activeTab === "completed" ? "bg-slate-900 hover:bg-slate-800" : "bg-transparent"}
          >
            Completed
            <Badge variant="secondary" className="ml-2">
              {counts.completed}
            </Badge>
          </Button>
          <Button
            variant={activeTab === "cancelled" ? "default" : "outline"}
            onClick={() => setActiveTab("cancelled")}
            className={activeTab === "cancelled" ? "bg-slate-900 hover:bg-slate-800" : "bg-transparent"}
          >
            Cancelled
            <Badge variant="secondary" className="ml-2">
              {counts.cancelled}
            </Badge>
          </Button>
          <Button
            variant={activeTab === "return-refund" ? "default" : "outline"}
            onClick={() => setActiveTab("return-refund")}
            className={activeTab === "return-refund" ? "bg-slate-900 hover:bg-slate-800" : "bg-transparent"}
          >
            Return Refund
            <Badge variant="secondary" className="ml-2">
              {counts.returnRefund}
            </Badge>
          </Button>
        </div>

        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No orders found</h3>
                <p className="text-muted-foreground mb-6">
                  {activeTab === "all"
                    ? "You haven't placed any orders yet"
                    : `No orders in ${activeTab.replace("-", " ")} status`}
                </p>
                <Button asChild>
                  <Link href="/">Start Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => {
              const statusBadge = getStatusBadge(order.status)
              const deliveryMsg = getDeliveryMessage(order.status)
              const contextText = getContextualText(order.status)

              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    {/* Store header with actions */}
                    <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                      <div className="flex items-center gap-3">
                        <Store className="w-5 h-5" />
                        <span className="font-semibold">Store Name</span>
                        <Button variant="destructive" size="sm" className="h-7 text-xs">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Chat
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                          <Store className="w-3 h-3 mr-1" />
                          View Shop
                        </Button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          {deliveryMsg.icon} {deliveryMsg.text}
                        </span>
                        <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
                      </div>
                    </div>

                    {/* Products list */}
                    <div className="divide-y">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 hover:bg-muted/20 transition-colors">
                          <div className="relative w-20 h-20 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                            <Image
                              src={item.image || "/placeholder.svg?height=80&width=80"}
                              alt={item.productName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/products/${item.productId}`}
                              className="font-medium hover:underline line-clamp-2"
                            >
                              {item.productName}
                            </Link>
                            <p className="text-sm text-muted-foreground mt-1">
                              Variation: {item.variant || "Standard"}
                            </p>
                            <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                          </div>
                          <div className="text-right">
                            {item.price < item.price * 1.2 && (
                              <div className="text-sm text-muted-foreground line-through">
                                ${(item.price * 1.2).toFixed(2)}
                              </div>
                            )}
                            <div className="text-lg font-semibold text-red-600">${item.price.toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order footer with total and actions */}
                    <div className="border-t bg-muted/20">
                      <div className="flex items-center justify-between p-4">
                        <div className="text-sm text-muted-foreground">{contextText}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Order Total:</span>
                          <span className="text-2xl font-bold text-red-600">${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-4 pt-0">{getActionButtons(order)}</div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </StoreLayout>
  )
}
