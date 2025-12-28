"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useOrders } from "@/lib/orders-context"
import { useAuth } from "@/lib/auth-context"
import { StoreLayout } from "@/components/store-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Edit,
  ChevronDown,
  MapPin,
  Mail,
  Phone,
  User,
} from "lucide-react"
import type { Order } from "@/lib/mock-data"

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { getOrderById } = useOrders()
  const [order, setOrder] = useState<Order | null>(null)
  const orderId = params.id

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user && orderId) {
      const foundOrder = getOrderById(orderId)
      if (foundOrder) {
        setOrder(foundOrder)
      }
    }
  }, [user, orderId, getOrderById])

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: Order["status"]) => {
    if (status === "delivered") return "bg-green-100 text-green-800"
    return "bg-orange-100 text-orange-800"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTrackingSteps = (status: Order["status"]) => {
    const steps = [
      { id: "pending", label: "Order confirmed", date: order?.createdAt, icon: Clock },
      { id: "processing", label: "Processing", date: order?.createdAt, icon: Package },
      { id: "shipped", label: "Shipped", date: null, icon: Truck },
      { id: "delivered", label: "Delivered", date: null, icon: CheckCircle2 },
    ]

    const statusOrder = ["pending", "processing", "shipped", "delivered"]
    const currentIndex = statusOrder.indexOf(status)

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }))
  }

  const calculateBreakdown = () => {
    const subtotal = order?.total || 0
    const discount = 1.0 // Example discount
    const shipping = 0.0 // Free shipping
    const tax = 0
    return {
      subtotal,
      discount,
      shipping,
      tax,
      total: subtotal + shipping + tax - discount,
    }
  }

  if (isLoading) {
    return (
      <StoreLayout showHero={false} showBreadcrumb={true}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </StoreLayout>
    )
  }

  if (!user || !order) {
    return (
      <StoreLayout showHero={false} showBreadcrumb={true}>
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto text-center py-12">
            <CardContent className="space-y-4">
              <XCircle className="w-16 h-16 text-muted-foreground mx-auto" />
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Order not found</h3>
                <p className="text-muted-foreground">The order you're looking for doesn't exist</p>
              </div>
              <Button asChild>
                <Link href="/orders">View All Orders</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </StoreLayout>
    )
  }

  const trackingSteps = getTrackingSteps(order.status)
  const breakdown = calculateBreakdown()

  return (
    <StoreLayout showHero={false} showBreadcrumb={true}>
      {/* Order Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Order ID: {order.id}</h1>
              <Badge className={`${getPaymentStatusColor(order.status)} border-0`}>
                {order.status === "delivered" ? "Payment received" : "Payment pending"}
              </Badge>
              <Badge className={`${getStatusColor(order.status)} border-0`}>
                {order.status === "delivered" ? "Fulfilled" : "Unfulfilled"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="md">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="md">
                More actions
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)} from Draft Orders</p>
        </div>
      </div>

      <div className="bg-muted/20 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items Card */}
              <Card>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Order Item</CardTitle>
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <Badge variant="outline" className="w-fit bg-red-50 text-red-700 border-red-200 mt-2">
                    Unfulfilled
                  </Badge>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-6">
                    Use this personalized guide to get your store up and running.
                  </p>

                  {order.items.map((item) => (
                    <div key={item.productId} className="flex gap-4 mb-6">
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-secondary border">
                        <Image
                          src="/placeholder.svg?height=64&width=64"
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">Laptop</p>
                        <h4 className="font-medium mb-2">{item.productName}</h4>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">Medium</span>
                          <span className="text-muted-foreground">Black</span>
                          <div className="w-4 h-4 bg-black rounded-sm border"></div>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-sm">
                          {item.quantity} × ${item.price.toFixed(2)}
                        </div>
                        <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    </div>
                  ))}

                  <p className="text-sm text-muted-foreground mb-4">
                    Effortlessly manage your orders with our intuitive Order List page.
                  </p>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="md"
                      className="border-black text-black hover:bg-black hover:text-white bg-transparent"
                    >
                      Fulfill item
                    </Button>
                    <Button variant="default" size="md" className="bg-black hover:bg-black/90 text-white">
                      Create shipping label
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary Card */}
              <Card>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Order Summary</CardTitle>
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <Badge variant="outline" className="w-fit bg-orange-50 text-orange-700 border-orange-200 mt-2">
                    Payment pending
                  </Badge>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-6">
                    Use this personalized guide to get your store up and running.
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <div className="text-right">
                        <span className="text-muted-foreground mr-4">{order.items.length} item</span>
                        <span className="font-medium">${breakdown.subtotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Discount</span>
                      <div className="text-right">
                        <span className="text-muted-foreground mr-4">New customer</span>
                        <span className="font-medium">-${breakdown.discount.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <div className="text-right">
                        <span className="text-muted-foreground mr-4">Free shipping (0.0 lb)</span>
                        <span className="font-medium">${breakdown.shipping.toFixed(2)}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${breakdown.total.toFixed(2)}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Paid by customer</span>
                      <span className="font-medium">${breakdown.total.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm items-center">
                      <span className="text-muted-foreground">Payment due when invoice is sent</span>
                      <Button variant="link" className="h-auto p-0 text-black hover:text-black/80">
                        Edit
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    Review your order at a glance on the Order Summary page.
                  </p>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="md"
                      className="border-black text-black hover:bg-black hover:text-white bg-transparent"
                    >
                      Send invoice
                    </Button>
                    <Button variant="default" size="md" className="bg-black hover:bg-black/90 text-white">
                      Collect payment
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline Card */}
              <Card>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Timeline</CardTitle>
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-6">
                    Use this personalized guide to get your store up and running.
                  </p>

                  <div className="relative py-6 mb-6">
                    <div className="flex justify-between items-start">
                      {trackingSteps.map((step, index) => {
                        const Icon = step.icon
                        return (
                          <div key={step.id} className="flex-1 flex flex-col items-center relative">
                            {index < trackingSteps.length - 1 && (
                              <div
                                className={`absolute top-6 left-[50%] h-0.5 w-full ${
                                  step.completed ? "bg-slate-900" : "bg-gray-200"
                                }`}
                              />
                            )}

                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all z-10 ${
                                step.active
                                  ? "bg-blue-500 text-white shadow-lg ring-4 ring-blue-100"
                                  : step.completed
                                    ? "bg-slate-900 text-white"
                                    : "bg-white text-gray-400 border-2 border-gray-200"
                              }`}
                            >
                              {step.completed ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                            </div>

                            <div className="mt-3 text-center">
                              <p
                                className={`text-sm font-medium ${
                                  step.active
                                    ? "text-blue-600"
                                    : step.completed
                                      ? "text-foreground"
                                      : "text-muted-foreground"
                                }`}
                              >
                                {step.label}
                              </p>
                              {step.completed && step.date && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(step.date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold">
                      {user?.name?.charAt(0) || "A"}
                    </div>
                    <input
                      type="text"
                      placeholder="Leave a comment..."
                      className="flex-1 bg-transparent border-none outline-none text-sm"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Notes Card */}
              <Card>
                <CardHeader className="border-b pt-4 pb-3 pl-4 pr-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">Notes</CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground italic">First customer and order!</p>
                </CardContent>
              </Card>

              {/* Customer Card */}
              <Card>
                <CardHeader className="border-b pt-4 pb-3 pl-4 pr-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">Customers</CardTitle>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{user?.name || "Alex Jander"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">1 Order</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Customer is tax-exempt</p>
                </CardContent>
              </Card>

              {/* Contact Information Card */}
              <Card>
                <CardHeader className="border-b p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">Contact Information</CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{user?.email || "alexjander@gmail.com"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">No phone number</span>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address Card */}
              <Card>
                <CardHeader className="border-b p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">Shipping address</CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm">{user?.name || "Alex Jander"}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm space-y-1">
                      <p>1226 University Drive</p>
                      <p>Menlo Park CA 94025</p>
                      <p>United States</p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p>+16282679041</p>
                  </div>
                  <Button variant="link" className="h-auto p-0 text-black hover:text-black/80 text-sm">
                    View Map
                  </Button>
                </CardContent>
              </Card>

              {/* Billing Address Card */}
              <Card>
                <CardHeader className="border-b p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">Billing address</CardTitle>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Same as shipping address</p>
                </CardContent>
              </Card>

              {/* Conversion Summary Card */}
              <Card>
                <CardHeader className="border-b p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">Conversion summary</CardTitle>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    There aren't any conversion details available for this order.
                  </p>
                  <Button variant="link" className="h-auto p-0 text-black hover:text-black/80 text-sm">
                    Learn more
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  )
}
