"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { MOCK_PRODUCTS, type Product } from "@/lib/mock-data"

interface ProductsContextType {
  products: Product[]
  addProduct: (product: Omit<Product, "id">) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const storedProducts = localStorage.getItem("products")
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts))
    } else {
      setProducts(MOCK_PRODUCTS)
      localStorage.setItem("products", JSON.stringify(MOCK_PRODUCTS))
    }
  }, [])

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("products", JSON.stringify(products))
    }
  }, [products])

  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
    }
    setProducts((prev) => [...prev, newProduct])
  }

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p)))
  }

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <ProductsContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider")
  }
  return context
}
