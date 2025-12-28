"use client"

import { FiltersPanel } from "@/components/filters-panel"
import { ProductCard } from "@/components/product-card"
import { StoreLayout } from "@/components/store-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useProducts } from "@/lib/products-context"
import { Filter, Search } from "lucide-react"
import { useMemo, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function ProductsPage() {
  const { products } = useProducts()
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([0, 1000])
  const [minRating, setMinRating] = useState(0)
  const [inStock, setInStock] = useState(false)
  const [sortBy, setSortBy] = useState("popularity")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category))), [products])
  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))), [products])
  const maxPrice = useMemo(() => Math.max(...products.map((p) => p.price)), [products])

  useEffect(() => {
    if (categoryParam) {
      const formattedCategory = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1).toLowerCase()
      setSelectedCategories([formattedCategory])
    }
  }, [categoryParam])

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          searchQuery === "" ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())

        return (
          matchesSearch &&
          p.price >= priceRange[0] &&
          p.price <= priceRange[1] &&
          (selectedCategories.length === 0 || selectedCategories.includes(p.category)) &&
          (selectedBrands.length === 0 || selectedBrands.includes(p.brand)) &&
          p.rating >= minRating &&
          (!inStock || p.stock > 0)
        )
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price
        if (sortBy === "price-desc") return b.price - a.price
        if (sortBy === "rating") return b.rating - a.rating
        return b.popularity - a.popularity
      })
  }, [products, searchQuery, selectedCategories, selectedBrands, priceRange, minRating, inStock, sortBy])

  const activeFiltersCount =
    selectedCategories.length + selectedBrands.length + (minRating > 0 ? 1 : 0) + (inStock ? 1 : 0)

  const filtersComponent = (
    <FiltersPanel
      categories={categories}
      brands={brands}
      selectedCategories={selectedCategories}
      selectedBrands={selectedBrands}
      tempPriceRange={tempPriceRange}
      maxPrice={maxPrice}
      minRating={minRating}
      inStock={inStock}
      activeFiltersCount={activeFiltersCount}
      onToggleCategory={(v) => setSelectedCategories((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]))}
      onToggleBrand={(v) => setSelectedBrands((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]))}
      onTempPriceChange={setTempPriceRange}
      onPriceCommit={setPriceRange}
      onRatingChange={setMinRating}
      onStockChange={setInStock}
      onClear={() => {
        setSelectedCategories([])
        setSelectedBrands([])
        setPriceRange([0, maxPrice])
        setTempPriceRange([0, maxPrice])
        setMinRating(0)
        setInStock(false)
      }}
    />
  )

  return (
    <StoreLayout showHero={false} className="pt-0">
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">
              {categoryParam ? `${categoryParam}'s Collection` : "All Products"}
            </p>
            <h1 className="font-serif text-4xl md:text-6xl mb-4 text-slate-900">
              {categoryParam
                ? `${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)}'s Essentials`
                : "Our Collection"}
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              {categoryParam
                ? `Discover our curated selection of premium ${categoryParam}'s wear, designed for the modern wardrobe.`
                : "Browse our complete collection of timeless pieces crafted with care and attention to detail."}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex gap-12">
          <aside className="hidden xl:block w-80 shrink-0 sticky top-24 self-start bg-white p-6 border border-slate-200 rounded-sm">
            {filtersComponent}
          </aside>

          <div className="flex-1 min-w-0">
            <div className="mb-8 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-white border-slate-300 focus:border-slate-900 rounded-sm"
                  placeholder="Search products..."
                />
              </div>

              <div className="flex gap-3">
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="xl:hidden flex-1 sm:flex-none h-12 border-slate-300 hover:bg-slate-50 rounded-sm bg-transparent"
                    >
                      <Filter className="w-5 h-5 mr-2" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <span className="ml-2 px-2.5 py-0.5 text-xs font-medium bg-slate-900 text-white rounded-full">
                          {activeFiltersCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full sm:w-96 overflow-y-auto bg-white p-8">
                    <SheetHeader className="mb-8 pb-6 border-b border-slate-200">
                      <SheetTitle className="text-2xl font-serif text-slate-900">Filters</SheetTitle>
                    </SheetHeader>
                    <div className="pr-2">{filtersComponent}</div>
                  </SheetContent>
                </Sheet>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-56 h-12 border-slate-300 rounded-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Most Popular</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
              <p className="text-sm text-slate-600">
                <span className="font-medium text-slate-900">{filteredProducts.length}</span>{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="max-w-md mx-auto">
                  <p className="text-slate-900 text-xl font-serif mb-3">No products found</p>
                  <p className="text-slate-600 mb-8">Try adjusting your filters or search query</p>
                  <Button
                    variant="outline"
                    className="border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white h-12 px-8 bg-transparent"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategories([])
                      setSelectedBrands([])
                      setPriceRange([0, maxPrice])
                      setTempPriceRange([0, maxPrice])
                      setMinRating(0)
                      setInStock(false)
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </StoreLayout>
  )
}
