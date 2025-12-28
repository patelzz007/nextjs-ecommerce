"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, X, Package, DollarSign, Truck, BarChart3 } from "lucide-react"
import type { Product, ProductVariant } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

interface ProductFormProps {
  product?: Product
  onSave: (product: Omit<Product, "id"> | Product) => void
  onCancel: () => void
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    originalPrice: product?.originalPrice || undefined,
    rating: product?.rating || 0,
    reviewCount: product?.reviewCount || 0,
    brand: product?.brand || "",
    image: product?.image || "",
    images: product?.images || [],
    category: product?.category || "",
    stock: product?.stock || 0,
    sku: product?.sku || "",
    merchantId: product?.merchantId || user?.id || "",
    tags: product?.tags || [],
    featured: product?.featured || false,
    popularity: product?.popularity || 0,
    variants: product?.variants || [],
    specifications: product?.specifications || {},
    shippingInfo: product?.shippingInfo || "",
    returnPolicy: product?.returnPolicy || "",
    status: product?.status || "draft",
    productType: product?.productType || "physical",
    weight: product?.weight || undefined,
    dimensions: product?.dimensions || undefined,
    isBundle: product?.isBundle || false,
    bundleItems: product?.bundleItems || [],
    lowStockThreshold: product?.lowStockThreshold || 10,
    allowBackorders: product?.allowBackorders || false,
    trackInventory: product?.trackInventory || true,
    barcode: product?.barcode || "",
    costPrice: product?.costPrice || 0,
    compareAtPrice: product?.compareAtPrice || undefined,
    taxable: product?.taxable || true,
    requiresShipping: product?.requiresShipping || true,
    metaTitle: product?.metaTitle || "",
    metaDescription: product?.metaDescription || "",
    createdAt: product?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  const [tagInput, setTagInput] = useState("")
  const [specKey, setSpecKey] = useState("")
  const [specValue, setSpecValue] = useState("")
  const [imageInput, setImageInput] = useState("")
  const [newVariant, setNewVariant] = useState<ProductVariant>({ id: "", name: "", options: [] })
  const [variantOption, setVariantOption] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (product) {
      onSave({ ...product, ...formData })
    } else {
      onSave(formData)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] })
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) })
  }

  const addSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      setFormData({
        ...formData,
        specifications: { ...formData.specifications, [specKey.trim()]: specValue.trim() },
      })
      setSpecKey("")
      setSpecValue("")
    }
  }

  const removeSpecification = (key: string) => {
    const newSpecs = { ...formData.specifications }
    delete newSpecs[key]
    setFormData({ ...formData, specifications: newSpecs })
  }

  const addImage = () => {
    if (imageInput.trim() && !formData.images?.includes(imageInput.trim())) {
      setFormData({ ...formData, images: [...(formData.images || []), imageInput.trim()] })
      setImageInput("")
    }
  }

  const removeImage = (image: string) => {
    setFormData({ ...formData, images: formData.images?.filter((img) => img !== image) })
  }

  const addVariant = () => {
    if (newVariant.name.trim() && newVariant.options.length > 0) {
      const variantToAdd = { ...newVariant, id: Date.now().toString() }
      setFormData({ ...formData, variants: [...(formData.variants || []), variantToAdd] })
      setNewVariant({ id: "", name: "", options: [] })
    }
  }

  const removeVariant = (variantId: string) => {
    setFormData({
      ...formData,
      variants: formData.variants?.filter((v) => v.id !== variantId),
    })
  }

  const addVariantOption = () => {
    if (variantOption.trim() && !newVariant.options.includes(variantOption.trim())) {
      setNewVariant({ ...newVariant, options: [...newVariant.options, variantOption.trim()] })
      setVariantOption("")
    }
  }

  const removeVariantOption = (option: string) => {
    setNewVariant({ ...newVariant, options: newVariant.options.filter((o) => o !== option) })
  }

  const profitMargin = formData.costPrice
    ? (((formData.price - formData.costPrice) / formData.price) * 100).toFixed(2)
    : "0"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "draft" | "published" | "archived") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="productType">Product Type</Label>
                <Select
                  value={formData.productType}
                  onValueChange={(value: "physical" | "digital") => setFormData({ ...formData, productType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physical">Physical Product</SelectItem>
                    <SelectItem value="digital">Digital Product</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Enter product name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  placeholder="Describe your product..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Brand name"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    placeholder="e.g., Electronics"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image">Primary Image URL *</Label>
                <Input
                  id="image"
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Additional Images</Label>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="https://example.com/image2.jpg"
                  />
                  <Button type="button" onClick={addImage} size="md">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.images?.map((img) => (
                    <Badge key={img} variant="secondary" className="gap-1">
                      Image
                      <button type="button" onClick={() => removeImage(img)} className="ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="Add tags..."
                  />
                  <Button type="button" onClick={addTag} size="md">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Featured Product</Label>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isBundle">Product Bundle</Label>
                <Switch
                  id="isBundle"
                  checked={formData.isBundle}
                  onCheckedChange={(checked) => setFormData({ ...formData, isBundle: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={specKey}
                  onChange={(e) => setSpecKey(e.target.value)}
                  placeholder="Key (e.g., Battery Life)"
                />
                <Input
                  value={specValue}
                  onChange={(e) => setSpecValue(e.target.value)}
                  placeholder="Value (e.g., 30 hours)"
                />
                <Button type="button" onClick={addSpecification} size="md">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {Object.entries(formData.specifications || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-2 bg-secondary rounded">
                    <span className="text-sm">
                      <strong>{key}:</strong> {value}
                    </span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeSpecification(key)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Selling Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="costPrice">Cost Price ($)</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: Number.parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="originalPrice">Original Price ($)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.originalPrice || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        originalPrice: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                      })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="compareAtPrice">Compare at Price ($)</Label>
                  <Input
                    id="compareAtPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.compareAtPrice || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        compareAtPrice: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
              </div>

              {formData.costPrice && formData.costPrice > 0 && (
                <div className="p-4 bg-secondary rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Profit Margin</span>
                    <Badge className="bg-green-600 text-white">{profitMargin}%</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Profit: ${(formData.price - formData.costPrice).toFixed(2)}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label htmlFor="taxable">Taxable Product</Label>
                <Switch
                  id="taxable"
                  checked={formData.taxable}
                  onCheckedChange={(checked) => setFormData({ ...formData, taxable: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Inventory Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="trackInventory">Track Inventory</Label>
                <Switch
                  id="trackInventory"
                  checked={formData.trackInventory}
                  onCheckedChange={(checked) => setFormData({ ...formData, trackInventory: checked })}
                />
              </div>

              {formData.trackInventory && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="stock">Current Stock *</Label>
                      <Input
                        id="stock"
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: Number.parseInt(e.target.value) })}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="lowStockThreshold">Low Stock Alert</Label>
                      <Input
                        id="lowStockThreshold"
                        type="number"
                        min="0"
                        value={formData.lowStockThreshold}
                        onChange={(e) =>
                          setFormData({ ...formData, lowStockThreshold: Number.parseInt(e.target.value) })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowBackorders">Allow Backorders</Label>
                    <Switch
                      id="allowBackorders"
                      checked={formData.allowBackorders}
                      onCheckedChange={(checked) => setFormData({ ...formData, allowBackorders: checked })}
                    />
                  </div>
                </>
              )}

              <div className="grid gap-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  required
                  placeholder="e.g., AT-WH-001"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="barcode">Barcode</Label>
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  placeholder="e.g., 1234567890"
                />
              </div>
            </CardContent>
          </Card>

          {formData.productType === "physical" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="requiresShipping">Requires Shipping</Label>
                  <Switch
                    id="requiresShipping"
                    checked={formData.requiresShipping}
                    onCheckedChange={(checked) => setFormData({ ...formData, requiresShipping: checked })}
                  />
                </div>

                {formData.requiresShipping && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.weight || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            weight: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                          })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="length">Length (cm)</Label>
                        <Input
                          id="length"
                          type="number"
                          step="0.1"
                          min="0"
                          value={formData.dimensions?.length || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              dimensions: {
                                ...formData.dimensions,
                                length: Number.parseFloat(e.target.value),
                                width: formData.dimensions?.width || 0,
                                height: formData.dimensions?.height || 0,
                              },
                            })
                          }
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="width">Width (cm)</Label>
                        <Input
                          id="width"
                          type="number"
                          step="0.1"
                          min="0"
                          value={formData.dimensions?.width || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              dimensions: {
                                ...formData.dimensions,
                                width: Number.parseFloat(e.target.value),
                                length: formData.dimensions?.length || 0,
                                height: formData.dimensions?.height || 0,
                              },
                            })
                          }
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          step="0.1"
                          min="0"
                          value={formData.dimensions?.height || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              dimensions: {
                                ...formData.dimensions,
                                height: Number.parseFloat(e.target.value),
                                length: formData.dimensions?.length || 0,
                                width: formData.dimensions?.width || 0,
                              },
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="shippingInfo">Shipping Information</Label>
                      <Textarea
                        id="shippingInfo"
                        value={formData.shippingInfo}
                        onChange={(e) => setFormData({ ...formData, shippingInfo: e.target.value })}
                        rows={2}
                        placeholder="Free shipping on orders over $50..."
                      />
                    </div>
                  </>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="returnPolicy">Return Policy</Label>
                  <Textarea
                    id="returnPolicy"
                    value={formData.returnPolicy}
                    onChange={(e) => setFormData({ ...formData, returnPolicy: e.target.value })}
                    rows={2}
                    placeholder="30-day return policy..."
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Variants Tab */}
        <TabsContent value="variants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label>Variant Name (e.g., Color, Size)</Label>
                  <Input
                    value={newVariant.name}
                    onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                    placeholder="Enter variant name"
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Options</Label>
                  <div className="flex gap-2">
                    <Input
                      value={variantOption}
                      onChange={(e) => setVariantOption(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addVariantOption())}
                      placeholder="Add option (e.g., Black, Small)"
                    />
                    <Button type="button" onClick={addVariantOption} size="md">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newVariant.options.map((option) => (
                      <Badge key={option} variant="secondary" className="gap-1">
                        {option}
                        <button type="button" onClick={() => removeVariantOption(option)} className="ml-1">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={addVariant}
                  variant="outline"
                  className="w-full bg-transparent"
                  disabled={!newVariant.name || newVariant.options.length === 0}
                >
                  Add Variant
                </Button>
              </div>

              <div className="space-y-2">
                {formData.variants?.map((variant) => (
                  <Card key={variant.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{variant.name}</h4>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {variant.options.map((option) => (
                              <Badge key={option} variant="outline">
                                {option}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeVariant(variant.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO & Meta Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="SEO-friendly title"
                  maxLength={60}
                />
                <span className="text-xs text-muted-foreground">{formData.metaTitle?.length || 0}/60 characters</span>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  placeholder="Brief description for search engines"
                  rows={3}
                  maxLength={160}
                />
                <span className="text-xs text-muted-foreground">
                  {formData.metaDescription?.length || 0}/160 characters
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} size="md">
          Cancel
        </Button>
        <Button type="submit" size="md">
          {product ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  )
}
