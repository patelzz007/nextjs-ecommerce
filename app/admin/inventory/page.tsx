"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useProducts } from "@/lib/products-context"
import { useInventory } from "@/lib/inventory-context"
import { useBreadcrumb } from "@/lib/breadcrumb-context"
import { Package, AlertCircle, TrendingUp, TrendingDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import type { Product } from "@/lib/mock-data"

type TabType = "all" | "low" | "out" | "history"

export default function InventoryPage() {
  const { products, updateProduct } = useProducts()
  const { adjustments, addAdjustment, getProductHistory, warehouses } = useInventory()
  const { setPageInfo } = useBreadcrumb()
  const [activeTab, setActiveTab] = useState<TabType>("all")
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false)
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [adjustmentType, setAdjustmentType] = useState<"adjustment" | "restock" | "damage">("adjustment")
  const [quantity, setQuantity] = useState("")
  const [reason, setReason] = useState("")
  const [notes, setNotes] = useState("")
  const [selectedWarehouse, setSelectedWarehouse] = useState(warehouses[0]?.id || "")

  useEffect(() => {
    setPageInfo("Inventory Management", "Track and manage your product stock levels")
  }, [setPageInfo])

  const lowStockProducts = products.filter(
    (p) => p.trackInventory && p.stock <= (p.lowStockThreshold || 10) && p.stock > 0,
  )
  const outOfStockProducts = products.filter((p) => p.trackInventory && p.stock === 0)

  const stats = {
    totalProducts: products.filter((p) => p.trackInventory).length,
    lowStock: lowStockProducts.length,
    outOfStock: outOfStockProducts.length,
    totalValue: products.reduce((sum, p) => sum + p.stock * (p.costPrice || p.price), 0),
  }

  const handleAdjustStock = (product: Product) => {
    setSelectedProduct(product)
    setAdjustDialogOpen(true)
    setQuantity("")
    setReason("")
    setNotes("")
    setAdjustmentType("adjustment")
  }

  const handleViewHistory = (product: Product) => {
    setSelectedProduct(product)
    setHistoryDialogOpen(true)
  }

  const handleSaveAdjustment = () => {
    if (!selectedProduct || !quantity || !reason) return

    const quantityNum = Number.parseInt(quantity)
    const newStock = selectedProduct.stock + quantityNum

    if (newStock < 0) {
      alert("Cannot reduce stock below 0")
      return
    }

    const warehouse = warehouses.find((w) => w.id === selectedWarehouse)

    addAdjustment({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      productSku: selectedProduct.sku,
      type: adjustmentType,
      quantity: quantityNum,
      previousStock: selectedProduct.stock,
      newStock: newStock,
      warehouseId: selectedWarehouse,
      warehouseName: warehouse?.name,
      reason,
      notes,
      createdBy: "Admin",
    })

    updateProduct(selectedProduct.id, { stock: newStock })

    setAdjustDialogOpen(false)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
        <p className="text-muted-foreground">Track and manage your product stock levels</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-lg">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tracked Products</p>
                <p className="text-2xl font-bold">{stats.totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold">{stats.lowStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold">{stats.outOfStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inventory Value</p>
                <p className="text-2xl font-bold">${stats.totalValue.toFixed(0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Button
          variant={activeTab === "all" ? "default" : "outline"}
          size="md"
          onClick={() => setActiveTab("all")}
          className="flex items-center gap-2"
        >
          All Products
          <Badge variant="secondary" className="ml-1">
            {stats.totalProducts}
          </Badge>
        </Button>
        <Button
          variant={activeTab === "low" ? "default" : "outline"}
          size="md"
          onClick={() => setActiveTab("low")}
          className="flex items-center gap-2"
        >
          Low Stock
          <Badge variant="secondary" className="ml-1">
            {stats.lowStock}
          </Badge>
        </Button>
        <Button
          variant={activeTab === "out" ? "default" : "outline"}
          size="md"
          onClick={() => setActiveTab("out")}
          className="flex items-center gap-2"
        >
          Out of Stock
          <Badge variant="secondary" className="ml-1">
            {stats.outOfStock}
          </Badge>
        </Button>
        <Button
          variant={activeTab === "history" ? "default" : "outline"}
          size="md"
          onClick={() => setActiveTab("history")}
        >
          Recent Activity
        </Button>
      </div>

      {activeTab === "all" && (
        <div className="space-y-4">
          <div className="grid gap-4">
            {products
              .filter((p) => p.trackInventory)
              .map((product) => (
                <Card key={product.id} className="border-2">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-secondary">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">SKU: {product.sku}</p>
                            <div className="flex gap-2 items-center">
                              <Badge
                                variant={
                                  product.stock === 0
                                    ? "destructive"
                                    : product.stock <= (product.lowStockThreshold || 10)
                                      ? "destructive"
                                      : "outline"
                                }
                              >
                                {product.stock === 0 ? "Out of Stock" : `Stock: ${product.stock}`}
                              </Badge>
                              {product.lowStockThreshold && (
                                <span className="text-xs text-muted-foreground">
                                  Alert at: {product.lowStockThreshold}
                                </span>
                              )}
                              {product.allowBackorders && (
                                <Badge variant="outline" className="text-xs">
                                  Backorders allowed
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="md" onClick={() => handleAdjustStock(product)}>
                              Adjust Stock
                            </Button>
                            <Button variant="outline" size="md" onClick={() => handleViewHistory(product)}>
                              View History
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {activeTab === "low" && (
        <div className="space-y-4">
          <div className="grid gap-4">
            {lowStockProducts.map((product) => (
              <Card key={product.id} className="border-2 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-secondary">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">SKU: {product.sku}</p>
                          <div className="flex gap-2 items-center">
                            <Badge variant="destructive">Stock: {product.stock}</Badge>
                            <span className="text-xs text-muted-foreground">
                              Threshold: {product.lowStockThreshold}
                            </span>
                          </div>
                        </div>

                        <Button variant="outline" size="md" onClick={() => handleAdjustStock(product)}>
                          Restock Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {lowStockProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No low stock products</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "out" && (
        <div className="space-y-4">
          <div className="grid gap-4">
            {outOfStockProducts.map((product) => (
              <Card key={product.id} className="border-2 border-red-200">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-secondary">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">SKU: {product.sku}</p>
                          <Badge variant="destructive">Out of Stock</Badge>
                        </div>

                        <Button size="md" onClick={() => handleAdjustStock(product)}>
                          Restock Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {outOfStockProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No out of stock products</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-4">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Recent Inventory Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adjustments.slice(0, 20).map((adj) => (
                  <div key={adj.id} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          adj.quantity > 0 ? "bg-green-100" : adj.quantity < 0 ? "bg-red-100" : "bg-gray-100"
                        }`}
                      >
                        {adj.quantity > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{adj.productName}</p>
                        <p className="text-sm text-muted-foreground">{adj.reason}</p>
                        {adj.warehouseName && (
                          <p className="text-xs text-muted-foreground">Warehouse: {adj.warehouseName}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${adj.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                        {adj.quantity > 0 ? "+" : ""}
                        {adj.quantity}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {adj.previousStock} → {adj.newStock}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatDate(adj.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
              {adjustments.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No inventory activity yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <Dialog open={adjustDialogOpen} onOpenChange={setAdjustDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock - {selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground">Current Stock</p>
              <p className="text-2xl font-bold">{selectedProduct?.stock}</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="adjustmentType">Adjustment Type</Label>
              <Select
                value={adjustmentType}
                onValueChange={(value: "adjustment" | "restock" | "damage") => setAdjustmentType(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adjustment">Manual Adjustment</SelectItem>
                  <SelectItem value="restock">Restock</SelectItem>
                  <SelectItem value="damage">Damage/Loss</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="warehouse">Warehouse</Label>
              <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((wh) => (
                    <SelectItem key={wh.id} value={wh.id}>
                      {wh.name} ({wh.location})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity Change</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter positive or negative number"
              />
              <p className="text-xs text-muted-foreground">
                Use positive numbers to add stock, negative to reduce (e.g., -5, +10)
              </p>
            </div>

            {quantity && (
              <div className="p-3 bg-secondary rounded-lg">
                <p className="text-sm">
                  New Stock: <span className="font-bold">{selectedProduct!.stock + Number.parseInt(quantity)}</span>
                </p>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="reason">Reason *</Label>
              <Input
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., New shipment received"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional details..."
                rows={3}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setAdjustDialogOpen(false)} size="md">
                Cancel
              </Button>
              <Button onClick={handleSaveAdjustment} disabled={!quantity || !reason} size="md">
                Save Adjustment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Stock History - {selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {selectedProduct &&
              getProductHistory(selectedProduct.id).map((adj) => (
                <div key={adj.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Badge variant={adj.quantity > 0 ? "outline" : "destructive"}>
                        {adj.type.charAt(0).toUpperCase() + adj.type.slice(1)}
                      </Badge>
                      {adj.warehouseName && (
                        <Badge variant="secondary" className="ml-2">
                          {adj.warehouseName}
                        </Badge>
                      )}
                    </div>
                    <span className={`font-bold ${adj.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                      {adj.quantity > 0 ? "+" : ""}
                      {adj.quantity}
                    </span>
                  </div>
                  <p className="font-medium mb-1">{adj.reason}</p>
                  {adj.notes && <p className="text-sm text-muted-foreground mb-2">{adj.notes}</p>}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {adj.previousStock} → {adj.newStock}
                    </span>
                    <span>{formatDate(adj.createdAt)}</span>
                  </div>
                </div>
              ))}
            {selectedProduct && getProductHistory(selectedProduct.id).length === 0 && (
              <div className="text-center py-8">
                <p className="text-lg text-muted-foreground">No history available for this product</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
