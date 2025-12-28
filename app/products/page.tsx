"use client";

import { FiltersPanel } from "@/components/filters-panel";
import { ProductCard } from "@/components/product-card";
import { StoreLayout } from "@/components/store-layout";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProducts } from "@/lib/products-context";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

export default function ProductsPage() {
   const { products } = useProducts();

   const [searchQuery, setSearchQuery] = useState("");
   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
   const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
   const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
   const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([0, 1000]);
   const [minRating, setMinRating] = useState(0);
   const [inStock, setInStock] = useState(false);
   const [sortBy, setSortBy] = useState("popularity");

   const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category))), [products]);
   const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))), [products]);
   const maxPrice = useMemo(() => Math.max(...products.map((p) => p.price)), [products]);

   const filteredProducts = useMemo(() => {
      return products
         .filter((p) => {
            return (
               p.price >= priceRange[0] &&
               p.price <= priceRange[1] &&
               (selectedCategories.length === 0 || selectedCategories.includes(p.category)) &&
               (selectedBrands.length === 0 || selectedBrands.includes(p.brand)) &&
               p.rating >= minRating &&
               (!inStock || p.stock > 0)
            );
         })
         .sort((a, b) => {
            if (sortBy === "price-asc") return a.price - b.price;
            if (sortBy === "price-desc") return b.price - a.price;
            if (sortBy === "rating") return b.rating - a.rating;
            return b.popularity - a.popularity;
         });
   }, [products, selectedCategories, selectedBrands, priceRange, minRating, inStock, sortBy]);

   const activeFiltersCount =
      selectedCategories.length + selectedBrands.length + (minRating > 0 ? 1 : 0) + (inStock ? 1 : 0);

   return (
      <StoreLayout showHero={false} className="pt-0">
         <div className="container mx-auto px-4 py-8">
            <div className="flex gap-8">
               <aside className="w-72 shrink-0 sticky top-24">
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
                     onToggleCategory={(v) =>
                        setSelectedCategories((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]))
                     }
                     onToggleBrand={(v) =>
                        setSelectedBrands((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]))
                     }
                     onTempPriceChange={setTempPriceRange}
                     onPriceCommit={setPriceRange}
                     onRatingChange={setMinRating}
                     onStockChange={setInStock}
                     onClear={() => {
                        setSelectedCategories([]);
                        setSelectedBrands([]);
                        setPriceRange([0, maxPrice]);
                        setTempPriceRange([0, maxPrice]);
                        setMinRating(0);
                        setInStock(false);
                     }}
                  />
               </aside>

               <div className="flex-1">
                  <div className="mb-6 flex gap-4">
                     <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className="pl-10"
                           placeholder="Search products..."
                        />
                     </div>

                     <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-50">
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="popularity">Most Popular</SelectItem>
                           <SelectItem value="price-asc">Price ↑</SelectItem>
                           <SelectItem value="price-desc">Price ↓</SelectItem>
                           <SelectItem value="rating">Rating</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                     {filteredProducts.map((p) => (
                        <ProductCard key={p.id} product={p} />
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </StoreLayout>
   );
}
