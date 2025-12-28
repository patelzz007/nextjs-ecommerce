"use client"

import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Minus, Plus, Trash2, ShoppingBag, Tag, X } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"
import { StoreLayout } from "@/components/store-layout"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    shipping,
    tax,
    finalTotal,
    applyPromoCode,
    removePromoCode,
    promoCode,
  } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [promoInput, setPromoInput] = useState("")
  const [promoError, setPromoError] = useState("")

  const handleApplyPromo = () => {
    if (applyPromoCode(promoInput)) {
      setPromoError("")
      setPromoInput("")
    } else {
      setPromoError("Invalid promo code")
    }
  }

  const handleCheckout = () => {
    router.push("/checkout")
  }

  return (
    <StoreLayout
      showHero={true}
      showBreadcrumb={true}
      heroBadge={{
        icon: ShoppingBag,
        text: "Secure Checkout",
      }}
      heroTitle="Your Shopping Cart"
      heroDescription="Review your items and proceed to checkout"
    >
      <div className="container mx-auto px-4 py-12">
        {cart.length === 0 ? (
          <Card className="border-2">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground mb-4">Your cart is empty</p>
              <Button asChild>
                <Link href="/">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.product.id} className="border-2">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-secondary">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg mb-1">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{item.product.category}</p>
                        <p className="text-lg font-bold">${item.product.price.toFixed(2)}</p>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-2 border-2 rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="h-8 w-8"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="h-8 w-8"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="border-2 sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Promo Code
                    </label>
                    {promoCode ? (
                      <div className="flex items-center gap-2 p-2 bg-green-50 border-2 border-green-200 rounded-md">
                        <Tag className="h-4 w-4 text-green-600" />
                        <span className="flex-1 text-sm font-medium text-green-700">{promoCode}</span>
                        <Button variant="ghost" size="icon" onClick={removePromoCode} className="h-6 w-6">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter code"
                          value={promoInput}
                          onChange={(e) => {
                            setPromoInput(e.target.value.toUpperCase())
                            setPromoError("")
                          }}
                          className={promoError ? "border-red-500" : ""}
                        />
                        <Button onClick={handleApplyPromo} variant="outline">
                          Apply
                        </Button>
                      </div>
                    )}
                    {promoError && <p className="text-sm text-red-500">{promoError}</p>}
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleCheckout} className="w-full" size="lg">
                    {user ? "Proceed to Checkout" : "Guest Checkout"}
                  </Button>

                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/">Continue Shopping</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  )
}
