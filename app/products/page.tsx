"use client";

import { useMemo, useState } from "react";
import { useProduct } from "@/lib/products-context";
import { useProductFilters } from "@/hooks/useProductFilters";
import { FiltersPanel } from "@/components/filters-panel";
import { ProductCard } from "@/components/product-card";
import { StoreLayout } from "@/components/store-layout";

export default function ProductsPage() {
   const { allProducts } = useProduct();
   const maxPrice = useMemo(
      () => (allProducts.length ? Math.max(...allProducts.map((p) => p.price)) : 0),
      [allProducts]
   );

   const [filters, setFilters] = useProductFilters(maxPrice);
   const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([0, maxPrice]);

   const categories = useMemo(() => Array.from(new Set(allProducts.map((p) => p.category))), [allProducts]);
   const brands = useMemo(() => Array.from(new Set(allProducts.map((p) => p.brand))), [allProducts]);

   // CASE-INSENSITIVE filtering for category
   const filteredProducts = useMemo(() => {
      return allProducts
         .filter((p) => {
            if (filters.q && !p.name.toLowerCase().includes(filters.q.toLowerCase())) return false;
            if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
            if (
               filters.categories.length &&
               !filters.categories.some((c) => c.toLowerCase() === p.category.toLowerCase())
            )
               return false;
            if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
            if (filters.rating && p.rating < filters.rating) return false;
            if (filters.stock && p.stock <= 0) return false;
            return true;
         })
         .slice()
         .sort((a, b) => {
            switch (filters.sort) {
               case "price-asc":
                  return a.price - b.price;
               case "price-desc":
                  return b.price - a.price;
               case "rating":
                  return b.rating - a.rating;
               default:
                  return b.popularity - a.popularity;
            }
         });
   }, [allProducts, filters]);

   const activeFiltersCount =
      filters.categories.length + filters.brands.length + (filters.rating > 0 ? 1 : 0) + (filters.stock ? 1 : 0);

   return (
      <StoreLayout showHero={false} className="pt-0">
         <div className="bg-slate-50 border-b border-slate-200">
            <div className="container mx-auto px-4 py-12 md:py-16 flex">
               <aside className="hidden xl:block w-80 sticky top-24 shrink-0">
                  <FiltersPanel
                     categories={categories}
                     brands={brands}
                     selectedCategories={filters.categories}
                     selectedBrands={filters.brands}
                     tempPriceRange={tempPriceRange}
                     maxPrice={maxPrice}
                     minRating={filters.rating}
                     inStock={!!filters.stock}
                     activeFiltersCount={activeFiltersCount}
                     onToggleCategory={(v) =>
                        setFilters({
                           categories: filters.categories.includes(v) ? filters.categories.filter((x) => x !== v) : [v], // always single category
                        })
                     }
                     onToggleBrand={(v) =>
                        setFilters({
                           brands: filters.brands.includes(v)
                              ? filters.brands.filter((x) => x !== v)
                              : [...filters.brands, v],
                        })
                     }
                     onTempPriceChange={setTempPriceRange}
                     onPriceCommit={(v) => setFilters({ minPrice: v[0], maxPrice: v[1] })}
                     onRatingChange={(v) => setFilters({ rating: v })}
                     onStockChange={(v) => setFilters({ stock: v ? 1 : 0 })}
                     onClear={() => {
                        setTempPriceRange([0, maxPrice]);
                        setFilters({
                           q: "",
                           categories: [],
                           brands: [],
                           minPrice: 0,
                           maxPrice,
                           rating: 0,
                           stock: 0,
                           sort: "popularity",
                        });
                     }}
                  />
               </aside>

               <main className="flex-1 min-w-0 xl:ml-8">
                  <p className="text-sm text-slate-500 mb-4">
                     {`${filteredProducts.length} item${filteredProducts.length !== 1 ? "s" : ""} available`}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                     {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                     ))}
                  </div>
               </main>
            </div>
         </div>
      </StoreLayout>
   );
}
