"use client"

import { useState, useMemo, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { useProducts } from "@/lib/products-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { StoreLayout } from "@/components/store-layout"
import { useSearchParams } from "next/navigation"
import { DualRangeSlider } from "@/components/ui/dual-range-slider"

export default function ProductsPage() {
  const { products } = useProducts()
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryParam ? [categoryParam] : [])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [minRating, setMinRating] = useState(0)
  const [inStock, setInStock] = useState(false)
  const [sortBy, setSortBy] = useState("popularity")

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategories([categoryParam])
    }
  }, [categoryParam])

  const categories = Array.from(new Set(products.map((p) => p.category)))
  const brands = Array.from(new Set(products.map((p) => p.brand)))
  const maxPrice = Math.max(...products.map((p) => p.price))

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand)
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      const matchesRating = product.rating >= minRating
      const matchesStock = !inStock || product.stock > 0

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesRating && matchesStock
    })

    // Sorting
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered.sort((a, b) => Number.parseInt(b.id) - Number.parseInt(a.id))
        break
      case "popularity":
      default:
        filtered.sort((a, b) => b.popularity - a.popularity)
        break
    }

    return filtered
  }, [products, searchQuery, selectedCategories, selectedBrands, priceRange, minRating, inStock, sortBy])

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategories([])
    setSelectedBrands([])
    setPriceRange([0, maxPrice])
    setMinRating(0)
    setInStock(false)
  }

  const activeFiltersCount =
    selectedCategories.length + selectedBrands.length + (minRating > 0 ? 1 : 0) + (inStock ? 1 : 0)

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <Label className="text-sm font-medium mb-3 block uppercase tracking-wider text-slate-700">Categories</Label>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-3">
              <Checkbox
                id={`cat-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
                className="border-slate-300"
              />
              <label htmlFor={`cat-${category}`} className="text-sm cursor-pointer flex-1 text-slate-700">
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="pt-4 border-t border-slate-200">
        <Label className="text-sm font-medium mb-3 block uppercase tracking-wider text-slate-700">Brands</Label>
        <div className="space-y-3">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-3">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
                className="border-slate-300"
              />
              <label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer flex-1 text-slate-700">
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="pt-4 border-t border-slate-200">
        <Label className="text-sm font-medium mb-3 block uppercase tracking-wider text-slate-700">Price Range</Label>
        <DualRangeSlider
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          max={maxPrice}
          min={0}
          step={10}
          label={(value) => <span className="text-xs font-medium text-slate-700">${value}</span>}
          labelPosition="top"
          className="mt-6 mb-4"
        />
      </div>

      {/* Rating */}
      <div className="pt-4 border-t border-slate-200">
        <Label className="text-sm font-medium mb-3 block uppercase tracking-wider text-slate-700">Minimum Rating</Label>
        <Select value={minRating.toString()} onValueChange={(value) => setMinRating(Number.parseFloat(value))}>
          <SelectTrigger className="border-slate-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">All Ratings</SelectItem>
            <SelectItem value="3">3+ Stars</SelectItem>
            <SelectItem value="4">4+ Stars</SelectItem>
            <SelectItem value="4.5">4.5+ Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Availability */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="in-stock"
            checked={inStock}
            onCheckedChange={(checked) => setInStock(checked as boolean)}
            className="border-slate-300"
          />
          <label htmlFor="in-stock" className="text-sm cursor-pointer text-slate-700">
            In Stock Only
          </label>
        </div>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <div className="pt-4">
          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white bg-transparent"
          >
            <X className="h-4 w-4 mr-2" />
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  )

  const getPageTitle = () => {
    if (categoryParam) {
      return categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)
    }
    return "All Products"
  }

  const getPageDescription = () => {
    if (categoryParam === "men") {
      return "Explore our curated collection of modern classics for men"
    }
    if (categoryParam === "women") {
      return "Discover timeless pieces designed for effortless elegance"
    }
    if (categoryParam === "accessories") {
      return "Complete your look with our refined accessories"
    }
    return "Browse our complete collection of carefully curated pieces"
  }

  return (
    <StoreLayout showHero={false} showBreadcrumb={false}>
      <div className="min-h-screen bg-white">
        <div className="border-b border-slate-200 bg-slate-50">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-3">{getPageTitle()}</h1>
            <p className="text-slate-600 max-w-2xl leading-relaxed">{getPageDescription()}</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 border-slate-300 focus:border-slate-900 rounded-none"
              />
            </div>

            <div className="flex gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px] h-12 border-slate-300 rounded-none">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Most Popular</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">New Arrivals</SelectItem>
                </SelectContent>
              </Select>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden h-12 border-slate-900 rounded-none bg-transparent">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filter
                    {activeFiltersCount > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs bg-slate-900 text-white rounded-full">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[320px] overflow-y-auto p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-serif text-slate-900">Filters</h2>
                  </div>
                  <FiltersContent />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="flex gap-8 lg:gap-12">
            <aside className="hidden md:block w-72 flex-shrink-0">
              <div className="sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-serif text-slate-900">Filters</h2>
                  {activeFiltersCount > 0 && (
                    <span className="inline-flex items-center justify-center w-6 h-6 text-xs bg-slate-900 text-white rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>
                <FiltersContent />
              </div>
            </aside>

            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
                <p className="text-sm text-slate-600">
                  {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-16 md:py-24">
                  <p className="text-lg text-slate-600 mb-6">No products found matching your criteria.</p>
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white rounded-none px-8 bg-transparent"
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  )
}
