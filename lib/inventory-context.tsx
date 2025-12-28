"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface InventoryAdjustment {
  id: string
  productId: string
  productName: string
  productSku: string
  type: "adjustment" | "sale" | "return" | "restock" | "damage" | "transfer"
  quantity: number // Positive for additions, negative for reductions
  previousStock: number
  newStock: number
  warehouseId?: string
  warehouseName?: string
  reason: string
  notes?: string
  createdBy: string
  createdAt: string
}

export interface Warehouse {
  id: string
  name: string
  location: string
  code: string
  isDefault: boolean
}

export interface WarehouseStock {
  warehouseId: string
  productId: string
  quantity: number
}

interface InventoryContextType {
  adjustments: InventoryAdjustment[]
  warehouses: Warehouse[]
  warehouseStock: WarehouseStock[]
  addAdjustment: (adjustment: Omit<InventoryAdjustment, "id" | "createdAt">) => void
  getProductHistory: (productId: string) => InventoryAdjustment[]
  getWarehouseStock: (warehouseId: string, productId: string) => number
  addWarehouse: (warehouse: Omit<Warehouse, "id">) => void
  updateWarehouse: (id: string, warehouse: Partial<Warehouse>) => void
  deleteWarehouse: (id: string) => void
  transferStock: (
    productId: string,
    fromWarehouseId: string,
    toWarehouseId: string,
    quantity: number,
    reason: string,
  ) => void
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [adjustments, setAdjustments] = useState<InventoryAdjustment[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [warehouseStock, setWarehouseStock] = useState<WarehouseStock[]>([])

  useEffect(() => {
    const storedAdjustments = localStorage.getItem("inventoryAdjustments")
    const storedWarehouses = localStorage.getItem("warehouses")
    const storedWarehouseStock = localStorage.getItem("warehouseStock")

    if (storedAdjustments) {
      setAdjustments(JSON.parse(storedAdjustments))
    }

    if (storedWarehouses) {
      setWarehouses(JSON.parse(storedWarehouses))
    } else {
      // Initialize with default warehouse
      const defaultWarehouse: Warehouse = {
        id: "wh-001",
        name: "Main Warehouse",
        location: "New York, NY",
        code: "NYC-01",
        isDefault: true,
      }
      setWarehouses([defaultWarehouse])
      localStorage.setItem("warehouses", JSON.stringify([defaultWarehouse]))
    }

    if (storedWarehouseStock) {
      setWarehouseStock(JSON.parse(storedWarehouseStock))
    }
  }, [])

  useEffect(() => {
    if (adjustments.length > 0) {
      localStorage.setItem("inventoryAdjustments", JSON.stringify(adjustments))
    }
  }, [adjustments])

  useEffect(() => {
    if (warehouses.length > 0) {
      localStorage.setItem("warehouses", JSON.stringify(warehouses))
    }
  }, [warehouses])

  useEffect(() => {
    if (warehouseStock.length > 0) {
      localStorage.setItem("warehouseStock", JSON.stringify(warehouseStock))
    }
  }, [warehouseStock])

  const addAdjustment = (adjustment: Omit<InventoryAdjustment, "id" | "createdAt">) => {
    const newAdjustment: InventoryAdjustment = {
      ...adjustment,
      id: `adj-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setAdjustments((prev) => [newAdjustment, ...prev])

    // Update warehouse stock if specified
    if (adjustment.warehouseId) {
      setWarehouseStock((prev) => {
        const existing = prev.find(
          (ws) => ws.warehouseId === adjustment.warehouseId && ws.productId === adjustment.productId,
        )
        if (existing) {
          return prev.map((ws) =>
            ws.warehouseId === adjustment.warehouseId && ws.productId === adjustment.productId
              ? { ...ws, quantity: adjustment.newStock }
              : ws,
          )
        } else {
          return [
            ...prev,
            {
              warehouseId: adjustment.warehouseId,
              productId: adjustment.productId,
              quantity: adjustment.newStock,
            },
          ]
        }
      })
    }
  }

  const getProductHistory = (productId: string) => {
    return adjustments.filter((adj) => adj.productId === productId)
  }

  const getWarehouseStock = (warehouseId: string, productId: string): number => {
    const stock = warehouseStock.find((ws) => ws.warehouseId === warehouseId && ws.productId === productId)
    return stock?.quantity || 0
  }

  const addWarehouse = (warehouse: Omit<Warehouse, "id">) => {
    const newWarehouse: Warehouse = {
      ...warehouse,
      id: `wh-${Date.now()}`,
    }
    setWarehouses((prev) => [...prev, newWarehouse])
  }

  const updateWarehouse = (id: string, warehouse: Partial<Warehouse>) => {
    setWarehouses((prev) => prev.map((wh) => (wh.id === id ? { ...wh, ...warehouse } : wh)))
  }

  const deleteWarehouse = (id: string) => {
    setWarehouses((prev) => prev.filter((wh) => wh.id !== id))
  }

  const transferStock = (
    productId: string,
    fromWarehouseId: string,
    toWarehouseId: string,
    quantity: number,
    reason: string,
  ) => {
    const fromWarehouse = warehouses.find((wh) => wh.id === fromWarehouseId)
    const toWarehouse = warehouses.find((wh) => wh.id === toWarehouseId)

    if (!fromWarehouse || !toWarehouse) return

    const fromStock = getWarehouseStock(fromWarehouseId, productId)

    // Deduct from source warehouse
    const deductAdjustment: Omit<InventoryAdjustment, "id" | "createdAt"> = {
      productId,
      productName: "",
      productSku: "",
      type: "transfer",
      quantity: -quantity,
      previousStock: fromStock,
      newStock: fromStock - quantity,
      warehouseId: fromWarehouseId,
      warehouseName: fromWarehouse.name,
      reason: `Transfer to ${toWarehouse.name}: ${reason}`,
      createdBy: "Admin",
    }
    addAdjustment(deductAdjustment)

    // Add to destination warehouse
    const toStock = getWarehouseStock(toWarehouseId, productId)
    const addAdjustment2: Omit<InventoryAdjustment, "id" | "createdAt"> = {
      productId,
      productName: "",
      productSku: "",
      type: "transfer",
      quantity: quantity,
      previousStock: toStock,
      newStock: toStock + quantity,
      warehouseId: toWarehouseId,
      warehouseName: toWarehouse.name,
      reason: `Transfer from ${fromWarehouse.name}: ${reason}`,
      createdBy: "Admin",
    }
    addAdjustment(addAdjustment2)
  }

  return (
    <InventoryContext.Provider
      value={{
        adjustments,
        warehouses,
        warehouseStock,
        addAdjustment,
        getProductHistory,
        getWarehouseStock,
        addWarehouse,
        updateWarehouse,
        deleteWarehouse,
        transferStock,
      }}
    >
      {children}
    </InventoryContext.Provider>
  )
}

export function useInventory() {
  const context = useContext(InventoryContext)
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider")
  }
  return context
}
