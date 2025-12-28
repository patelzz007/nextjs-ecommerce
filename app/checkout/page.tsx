"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { useOrders } from "@/lib/orders-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { StoreLayout } from "@/components/store-layout"
import { useToast } from "@/hooks/use-toast"
import { ShoppingBag, User, MapPin, Truck, CreditCard, Check, ChevronRight, Plus, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

type CheckoutStep = "contact" | "address" | "shipping" | "payment" | "review"

interface ContactInfo {
  email: string
  phone: string
  firstName: string
  lastName: string
}

interface Address {
  id: string
  label: string
  street: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
}

interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
}

interface PaymentMethod {
  id: string
  type: "card" | "paypal" | "apple"
  name: string
  last4?: string
}

const SAVED_ADDRESSES: Address[] = [
  {
    id: "1",
    label: "Home",
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    isDefault: true,
  },
  {
    id: "2",
    label: "Office",
    street: "456 Business Ave",
    city: "New York",
    state: "NY",
    zipCode: "10002",
    isDefault: false,
  },
]

const SHIPPING_METHODS: ShippingMethod[] = [
  { id: "standard", name: "Standard Shipping", description: "5-7 business days", price: 0, estimatedDays: "5-7 days" },
  { id: "express", name: "Express Shipping", description: "2-3 business days", price: 15, estimatedDays: "2-3 days" },
  { id: "overnight", name: "Overnight Shipping", description: "Next business day", price: 35, estimatedDays: "1 day" },
]

const SAVED_PAYMENT_METHODS: PaymentMethod[] = [
  { id: "1", type: "card", name: "Visa", last4: "4242" },
  { id: "2", type: "card", name: "Mastercard", last4: "5555" },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart, subtotal, discount, shipping: shippingCostFromCart, tax, finalTotal } = useCart()
  const { addOrder } = useOrders()
  const { user } = useAuth()
  const { toast } = useToast()

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("contact")
  const [completedSteps, setCompletedSteps] = useState<CheckoutStep[]>([])

  // Contact info
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: user?.email || "",
    phone: "",
    firstName: user?.name.split(" ")[0] || "",
    lastName: user?.name.split(" ")[1] || "",
  })

  // Address
  const [selectedAddressId, setSelectedAddressId] = useState<string>(SAVED_ADDRESSES[0]?.id || "")
  const [isNewAddress, setIsNewAddress] = useState(false)
  const [newAddress, setNewAddress] = useState<Omit<Address, "id" | "isDefault">>({
    label: "Home",
    street: "",
    city: "",
    state: "",
    zipCode: "",
  })

  // Shipping
  const [selectedShippingId, setSelectedShippingId] = useState<string>("standard")
  const [shippingCost, setShippingCost] = useState(0)

  // Payment
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>(SAVED_PAYMENT_METHODS[0]?.id || "")
  const [isNewPayment, setIsNewPayment] = useState(false)

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (cart.length === 0) {
      router.push("/cart")
    }
  }, [cart, router])

  useEffect(() => {
    const method = SHIPPING_METHODS.find((m) => m.id === selectedShippingId)
    setShippingCost(method?.price || 0)
  }, [selectedShippingId])

  const steps: { id: CheckoutStep; label: string; icon: any }[] = [
    { id: "contact", label: "Contact", icon: User },
    { id: "address", label: "Address", icon: MapPin },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "review", label: "Review", icon: Package },
  ]

  const validateContact = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!contactInfo.email) newErrors.email = "Email is required"
    if (!contactInfo.phone) newErrors.phone = "Phone is required"
    if (!contactInfo.firstName) newErrors.firstName = "First name is required"
    if (!contactInfo.lastName) newErrors.lastName = "Last name is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateAddress = (): boolean => {
    if (!isNewAddress) return !!selectedAddressId
    const newErrors: Record<string, string> = {}
    if (!newAddress.street) newErrors.street = "Street is required"
    if (!newAddress.city) newErrors.city = "City is required"
    if (!newAddress.state) newErrors.state = "State is required"
    if (!newAddress.zipCode) newErrors.zipCode = "ZIP code is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    let isValid = true

    if (currentStep === "contact") {
      isValid = validateContact()
    } else if (currentStep === "address") {
      isValid = validateAddress()
    }

    if (!isValid) return

    setCompletedSteps([...completedSteps, currentStep])
    const currentIndex = steps.findIndex((s) => s.id === currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id)
    }
  }

  const handleBack = () => {
    const currentIndex = steps.findIndex((s) => s.id === currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id)
    }
  }

  const handlePlaceOrder = () => {
    const orderId = addOrder({
      userId: user?.id || "guest",
      userName: user?.name || `${contactInfo.firstName} ${contactInfo.lastName}`,
      userEmail: user?.email || contactInfo.email,
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total: finalTotal,
      status: "pending",
    })

    toast({
      title: "Order placed successfully!",
      description: `Order #${orderId} has been confirmed and will be processed shortly.`,
    })
    clearCart()
    setTimeout(() => {
      router.push(`/orders/${orderId}`)
    }, 1500)
  }

  const totalWithShipping = finalTotal + shippingCost

  if (cart.length === 0) return null

  return (
    <StoreLayout
      showHero={true}
      showBreadcrumb={true}
      heroBadge={{
        icon: ShoppingBag,
        text: "Secure Checkout",
      }}
      heroTitle="Checkout"
      heroDescription="Complete your order in a few simple steps"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isCompleted = completedSteps.includes(step.id)
              const isCurrent = currentStep === step.id

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all",
                        isCompleted && "bg-black border-black text-white",
                        isCurrent && "border-black text-black",
                        !isCompleted && !isCurrent && "border-gray-300 text-gray-400",
                      )}
                    >
                      {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <span
                      className={cn(
                        "text-xs mt-2 font-medium",
                        (isCompleted || isCurrent) && "text-black",
                        !isCompleted && !isCurrent && "text-gray-400",
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn("h-0.5 flex-1 mx-2 transition-all", isCompleted ? "bg-black" : "bg-gray-300")} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-2">
              <CardContent className="p-6">
                {/* Contact Step */}
                {currentStep === "contact" && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={contactInfo.firstName}
                          onChange={(e) => setContactInfo({ ...contactInfo, firstName: e.target.value })}
                          className={errors.firstName ? "border-red-500" : ""}
                        />
                        {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={contactInfo.lastName}
                          onChange={(e) => setContactInfo({ ...contactInfo, lastName: e.target.value })}
                          className={errors.lastName ? "border-red-500" : ""}
                        />
                        {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                )}

                {/* Address Step */}
                {currentStep === "address" && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>

                    {user && SAVED_ADDRESSES.length > 0 && !isNewAddress && (
                      <div className="space-y-3">
                        <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId}>
                          {SAVED_ADDRESSES.map((address) => (
                            <div key={address.id} className="flex items-start space-x-3 border-2 p-4 rounded-lg">
                              <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                              <label htmlFor={address.id} className="flex-1 cursor-pointer">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{address.label}</span>
                                  {address.isDefault && <Badge variant="secondary">Default</Badge>}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {address.street}, {address.city}, {address.state} {address.zipCode}
                                </p>
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                        <Button variant="outline" onClick={() => setIsNewAddress(true)} className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Add New Address
                        </Button>
                      </div>
                    )}

                    {(isNewAddress || !user || SAVED_ADDRESSES.length === 0) && (
                      <div className="space-y-4">
                        {isNewAddress && (
                          <Button variant="ghost" onClick={() => setIsNewAddress(false)} className="mb-2">
                            ← Back to saved addresses
                          </Button>
                        )}
                        <div>
                          <Label htmlFor="label">Address Label</Label>
                          <Input
                            id="label"
                            value={newAddress.label}
                            onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                            placeholder="Home, Office, etc."
                          />
                        </div>
                        <div>
                          <Label htmlFor="street">Street Address</Label>
                          <Input
                            id="street"
                            value={newAddress.street}
                            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                            className={errors.street ? "border-red-500" : ""}
                          />
                          {errors.street && <p className="text-sm text-red-500 mt-1">{errors.street}</p>}
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              value={newAddress.city}
                              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                              className={errors.city ? "border-red-500" : ""}
                            />
                            {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
                          </div>
                          <div>
                            <Label htmlFor="state">State</Label>
                            <Input
                              id="state"
                              value={newAddress.state}
                              onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                              className={errors.state ? "border-red-500" : ""}
                            />
                            {errors.state && <p className="text-sm text-red-500 mt-1">{errors.state}</p>}
                          </div>
                          <div>
                            <Label htmlFor="zipCode">ZIP Code</Label>
                            <Input
                              id="zipCode"
                              value={newAddress.zipCode}
                              onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                              className={errors.zipCode ? "border-red-500" : ""}
                            />
                            {errors.zipCode && <p className="text-sm text-red-500 mt-1">{errors.zipCode}</p>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Shipping Step */}
                {currentStep === "shipping" && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold mb-4">Shipping Method</h2>
                    <RadioGroup value={selectedShippingId} onValueChange={setSelectedShippingId}>
                      {SHIPPING_METHODS.map((method) => (
                        <div key={method.id} className="flex items-start space-x-3 border-2 p-4 rounded-lg">
                          <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                          <label htmlFor={method.id} className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{method.name}</span>
                              <span className="font-bold">
                                {method.price === 0 ? "Free" : `$${method.price.toFixed(2)}`}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{method.description}</p>
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {/* Payment Step */}
                {currentStep === "payment" && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold mb-4">Payment Method</h2>

                    {user && SAVED_PAYMENT_METHODS.length > 0 && !isNewPayment && (
                      <div className="space-y-3">
                        <RadioGroup value={selectedPaymentId} onValueChange={setSelectedPaymentId}>
                          {SAVED_PAYMENT_METHODS.map((method) => (
                            <div key={method.id} className="flex items-start space-x-3 border-2 p-4 rounded-lg">
                              <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                              <label htmlFor={method.id} className="flex-1 cursor-pointer">
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-5 w-5" />
                                  <span className="font-medium">
                                    {method.name} •••• {method.last4}
                                  </span>
                                </div>
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                        <Button variant="outline" onClick={() => setIsNewPayment(true)} className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Add New Payment Method
                        </Button>
                      </div>
                    )}

                    {(isNewPayment || !user || SAVED_PAYMENT_METHODS.length === 0) && (
                      <div className="space-y-4">
                        {isNewPayment && (
                          <Button variant="ghost" onClick={() => setIsNewPayment(false)} className="mb-2">
                            ← Back to saved payment methods
                          </Button>
                        )}
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input id="expiry" placeholder="MM/YY" />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="123" type="password" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="cardName">Name on Card</Label>
                          <Input id="cardName" placeholder="John Doe" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Review Step */}
                {currentStep === "review" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Review Order</h2>

                    <div>
                      <h3 className="font-medium mb-2">Contact Information</h3>
                      <p className="text-sm text-muted-foreground">
                        {contactInfo.firstName} {contactInfo.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{contactInfo.email}</p>
                      <p className="text-sm text-muted-foreground">{contactInfo.phone}</p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2">Shipping Address</h3>
                      {isNewAddress ? (
                        <p className="text-sm text-muted-foreground">
                          {newAddress.street}, {newAddress.city}, {newAddress.state} {newAddress.zipCode}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {SAVED_ADDRESSES.find((a) => a.id === selectedAddressId)?.street},{" "}
                          {SAVED_ADDRESSES.find((a) => a.id === selectedAddressId)?.city},{" "}
                          {SAVED_ADDRESSES.find((a) => a.id === selectedAddressId)?.state}{" "}
                          {SAVED_ADDRESSES.find((a) => a.id === selectedAddressId)?.zipCode}
                        </p>
                      )}
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2">Shipping Method</h3>
                      <p className="text-sm text-muted-foreground">
                        {SHIPPING_METHODS.find((m) => m.id === selectedShippingId)?.name} -{" "}
                        {SHIPPING_METHODS.find((m) => m.id === selectedShippingId)?.description}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2">Payment Method</h3>
                      {isNewPayment ? (
                        <p className="text-sm text-muted-foreground">New Card</p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {SAVED_PAYMENT_METHODS.find((p) => p.id === selectedPaymentId)?.name} ••••{" "}
                          {SAVED_PAYMENT_METHODS.find((p) => p.id === selectedPaymentId)?.last4}
                        </p>
                      )}
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-3">Order Items</h3>
                      <div className="space-y-3">
                        {cart.map((item) => (
                          <div key={item.product.id} className="flex gap-3">
                            <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-secondary">
                              <Image
                                src={item.product.image || "/placeholder.svg"}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{item.product.name}</p>
                              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-medium text-sm">${(item.product.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <Button variant="outline" onClick={handleBack} disabled={currentStep === "contact"}>
                    Back
                  </Button>
                  {currentStep === "review" ? (
                    <Button onClick={handlePlaceOrder} size="lg">
                      Place Order
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={handleNext} size="lg">
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-2 sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
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
                    <span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${totalWithShipping.toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground pt-4 border-t">
                  <p className="mb-2">🔒 Secure checkout</p>
                  <p>Your payment information is encrypted and secure.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StoreLayout>
  )
}
