"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Order } from "@/lib/mock-data"
import { MOCK_ORDERS } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

interface OrdersContextType {
  orders: Order[]
  addOrder: (order: Omit<Order, "id" | "createdAt">) => string
  getOrderById: (orderId: string) => Order | undefined
  getUserOrders: () => Order[]
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS)

  useEffect(() => {
    const storedOrders = localStorage.getItem("orders")
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders))
  }, [orders])

  const addOrder = (orderData: Omit<Order, "id" | "createdAt">): string => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setOrders((prev) => [newOrder, ...prev])
    return newOrder.id
  }

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((order) => order.id === orderId)
  }

  const getUserOrders = (): Order[] => {
    if (!user) return []
    return orders
      .filter((order) => order.userId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)))
  }

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        getOrderById,
        getUserOrders,
        updateOrderStatus,
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrdersProvider")
  }
  return context
}
