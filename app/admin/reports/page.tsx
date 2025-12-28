"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useProducts } from "@/lib/products-context"
import { useInventory } from "@/lib/inventory-context"
import { useBreadcrumb } from "@/lib/breadcrumb-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Package, DollarSign, AlertCircle, BarChart3, FileText, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ReportsPage() {
  const { products } = useProducts()
  const { adjustments } = useInventory()
  const { setPageInfo } = useBreadcrumb()
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d")

  useEffect(() => {
    setPageInfo("Reports & Analytics", "Inventory insights and performance metrics")
  }, [setPageInfo])

  const now = new Date()
  const getTimeRangeDate = () => {
    switch (timeRange) {
      case "7d":
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      case "30d":
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      case "90d":
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      default:
        return new Date(0)
    }
  }

  const filteredAdjustments = adjustments.filter((adj) => new Date(adj.createdAt) >= getTimeRangeDate())

  // Calculate metrics
  const totalInventoryValue = products.reduce((sum, p) => sum + p.stock * (p.costPrice || p.price), 0)
  const totalRetailValue = products.reduce((sum, p) => sum + p.stock * p.price, 0)
  const potentialProfit = totalRetailValue - totalInventoryValue

  const stockChanges = filteredAdjustments.reduce(
    (acc, adj) => {
      if (adj.quantity > 0) acc.added += adj.quantity
      else acc.removed += Math.abs(adj.quantity)
      return acc
    },
    { added: 0, removed: 0 },
  )

  // Low stock alerts
  const lowStockProducts = products.filter(
    (p) => p.trackInventory && p.stock <= (p.lowStockThreshold || 10) && p.stock > 0,
  )
  const outOfStockProducts = products.filter((p) => p.trackInventory && p.stock === 0)

  // Product performance
  const productsByValue = [...products]
    .map((p) => ({
      ...p,
      inventoryValue: p.stock * (p.costPrice || p.price),
    }))
    .sort((a, b) => b.inventoryValue - a.inventoryValue)
    .slice(0, 10)

  // Stock movement by type
  const movementByType = filteredAdjustments.reduce(
    (acc, adj) => {
      acc[adj.type] = (acc[adj.type] || 0) + Math.abs(adj.quantity)
      return acc
    },
    {} as Record<string, number>,
  )

  // Category breakdown
  const categoryStats = products.reduce(
    (acc, p) => {
      if (!acc[p.category]) {
        acc[p.category] = { count: 0, value: 0, stock: 0 }
      }
      acc[p.category].count++
      acc[p.category].value += p.stock * (p.costPrice || p.price)
      acc[p.category].stock += p.stock
      return acc
    },
    {} as Record<string, { count: number; value: number; stock: number }>,
  )

  const exportReport = (reportType: string) => {
    const timestamp = new Date().toISOString().split("T")[0]
    const filename = `inventory-${reportType}-${timestamp}.csv`

    let csvContent = ""

    if (reportType === "inventory") {
      csvContent =
        "SKU,Product Name,Category,Stock,Cost Price,Retail Price,Inventory Value,Status\n" +
        products
          .map(
            (p) =>
              `"${p.sku}","${p.name}","${p.category}",${p.stock},${p.costPrice || p.price},${p.price},${p.stock * (p.costPrice || p.price)},"${p.status}"`,
          )
          .join("\n")
    } else if (reportType === "adjustments") {
      csvContent =
        "Date,Product,SKU,Type,Quantity,Previous Stock,New Stock,Reason,Warehouse\n" +
        filteredAdjustments
          .map(
            (adj) =>
              `"${new Date(adj.createdAt).toLocaleDateString()}","${adj.productName}","${adj.productSku}","${adj.type}",${adj.quantity},${adj.previousStock},${adj.newStock},"${adj.reason}","${adj.warehouseName || "N/A"}"`,
          )
          .join("\n")
    } else if (reportType === "alerts") {
      csvContent =
        "SKU,Product Name,Current Stock,Threshold,Status\n" +
        [...lowStockProducts, ...outOfStockProducts]
          .map(
            (p) =>
              `"${p.sku}","${p.name}",${p.stock},${p.lowStockThreshold || 10},"${p.stock === 0 ? "Out of Stock" : "Low Stock"}"`,
          )
          .join("\n")
    }

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">Inventory insights and performance metrics</p>
        </div>
        <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-lg">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inventory Value</p>
                <p className="text-2xl font-bold">${totalInventoryValue.toFixed(0)}</p>
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
                <p className="text-sm text-muted-foreground">Potential Profit</p>
                <p className="text-2xl font-bold">${potentialProfit.toFixed(0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Stock Added</p>
                <p className="text-2xl font-bold">{stockChanges.added}</p>
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
                <p className="text-sm text-muted-foreground">Alerts</p>
                <p className="text-2xl font-bold">{lowStockProducts.length + outOfStockProducts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="alerts">Alerts ({lowStockProducts.length + outOfStockProducts.length})</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="movement">Stock Movement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-2">
              <CardHeader className="border-b px-4 py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Category Breakdown</CardTitle>
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {Object.entries(categoryStats)
                    .sort((a, b) => b[1].value - a[1].value)
                    .map(([category, stats]) => (
                      <div key={category} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{category}</p>
                          <p className="text-sm text-muted-foreground">
                            {stats.count} products • {stats.stock} units
                          </p>
                        </div>
                        <p className="font-bold">${stats.value.toFixed(0)}</p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="border-b px-4 py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Stock Movement by Type</CardTitle>
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {Object.entries(movementByType)
                    .sort((a, b) => b[1] - a[1])
                    .map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium capitalize">{type}</p>
                        </div>
                        <Badge variant="outline">{count} units</Badge>
                      </div>
                    ))}
                  {Object.keys(movementByType).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No stock movements in this period</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2">
            <CardHeader className="border-b px-4 py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Export Reports</CardTitle>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" onClick={() => exportReport("inventory")} className="gap-2">
                  <Download className="h-4 w-4" />
                  Inventory Report
                </Button>
                <Button variant="outline" onClick={() => exportReport("adjustments")} className="gap-2">
                  <Download className="h-4 w-4" />
                  Stock Movements
                </Button>
                <Button variant="outline" onClick={() => exportReport("alerts")} className="gap-2">
                  <Download className="h-4 w-4" />
                  Stock Alerts
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {outOfStockProducts.length > 0 && (
            <Card className="border-2 border-red-200">
              <CardHeader className="border-b px-4 py-3 bg-red-50">
                <CardTitle className="text-lg text-red-900">Out of Stock ({outOfStockProducts.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {outOfStockProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-secondary">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                        </div>
                      </div>
                      <Badge variant="destructive">Out of Stock</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {lowStockProducts.length > 0 && (
            <Card className="border-2 border-yellow-200">
              <CardHeader className="border-b px-4 py-3 bg-yellow-50">
                <CardTitle className="text-lg text-yellow-900">Low Stock ({lowStockProducts.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {lowStockProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-secondary">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            SKU: {product.sku} • Stock: {product.stock} / Threshold: {product.lowStockThreshold}
                          </p>
                        </div>
                      </div>
                      <Badge variant="destructive">Low Stock</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {lowStockProducts.length === 0 && outOfStockProducts.length === 0 && (
            <Card className="border-2">
              <CardContent className="p-12 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No Stock Alerts</p>
                <p className="text-sm text-muted-foreground">All products are well stocked</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card className="border-2">
            <CardHeader className="border-b px-4 py-3">
              <CardTitle className="text-lg">Top 10 Products by Inventory Value</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {productsByValue.map((product, index) => (
                  <div key={product.id} className="flex items-center gap-4">
                    <div className="text-lg font-bold text-muted-foreground w-6">{index + 1}</div>
                    <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-secondary">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Stock: {product.stock} • Cost: ${product.costPrice?.toFixed(2) || product.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${product.inventoryValue.toFixed(0)}</p>
                      <p className="text-xs text-muted-foreground">Inventory Value</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movement" className="space-y-4">
          <Card className="border-2">
            <CardHeader className="border-b px-4 py-3">
              <CardTitle className="text-lg">Recent Stock Movements ({filteredAdjustments.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {filteredAdjustments.slice(0, 50).map((adj) => (
                  <div key={adj.id} className="flex items-center justify-between p-3 border rounded">
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
                      <p className="text-xs text-muted-foreground">{new Date(adj.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                {filteredAdjustments.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No stock movements in this period</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
