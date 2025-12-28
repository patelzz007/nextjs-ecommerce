"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { Product, CartItem } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartTotal: number
  cartCount: number
  applyPromoCode: (code: string) => boolean
  removePromoCode: () => void
  promoCode: string | null
  discount: number
  subtotal: number
  shipping: number
  tax: number
  finalTotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const PROMO_CODES: Record<string, { discount: number; type: "percentage" | "fixed" }> = {
  SAVE10: { discount: 10, type: "percentage" },
  SAVE20: { discount: 20, type: "percentage" },
  FLAT50: { discount: 50, type: "fixed" },
  FREESHIP: { discount: 100, type: "percentage" }, // Free shipping
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [cart, setCart] = useState<CartItem[]>([])
  const [promoCode, setPromoCode] = useState<string | null>(null)

  useEffect(() => {
    const cartKey = user ? `cart_${user.id}` : "cart_guest"
    const storedCart = localStorage.getItem(cartKey)
    if (storedCart) {
      setCart(JSON.parse(storedCart))
    }
  }, [user])

  useEffect(() => {
    const cartKey = user ? `cart_${user.id}` : "cart_guest"
    localStorage.setItem(cartKey, JSON.stringify(cart))
  }, [cart, user])

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id)
      if (existingItem) {
        return prev.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prev) => prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
    setPromoCode(null)
  }

  const applyPromoCode = (code: string): boolean => {
    const upperCode = code.toUpperCase()
    if (PROMO_CODES[upperCode]) {
      setPromoCode(upperCode)
      return true
    }
    return false
  }

  const removePromoCode = () => {
    setPromoCode(null)
  }

  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0)

  let discount = 0
  if (promoCode && PROMO_CODES[promoCode]) {
    const promo = PROMO_CODES[promoCode]
    if (promo.type === "percentage") {
      discount = (subtotal * promo.discount) / 100
    } else {
      discount = promo.discount
    }
  }

  const shipping = subtotal > 100 ? 0 : 15 // Free shipping over $100
  const tax = (subtotal - discount) * 0.08 // 8% tax
  const finalTotal = Math.max(0, subtotal - discount + shipping + tax)

  const cartTotal = subtotal
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        applyPromoCode,
        removePromoCode,
        promoCode,
        discount,
        subtotal,
        shipping,
        tax,
        finalTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
