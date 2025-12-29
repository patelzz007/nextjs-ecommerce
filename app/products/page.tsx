"use client";

import { useEffect, useMemo, useState } from "react";
import { MOCK_PRODUCTS, type Product } from "@/lib/mock-data";
import { useRouter, useSearchParams } from "next/navigation";
import { FiltersPanel } from "@/components/filters-panel";
import { ProductCard } from "@/components/product-card";
import { StoreLayout } from "@/components/store-layout";

type SortOption = "popularity" | "price-asc" | "price-desc" | "rating";

interface ProductFilters {
   q: string;
   categories: string[];
   brands: string[];
   minPrice: number;
   maxPrice: number;
   rating: number;
   stock: number;
   sort: SortOption;
}

function createDefaultFilters(maxPrice: number): ProductFilters {
   return {
      q: "",
      categories: [],
      brands: [],
      minPrice: 0,
      maxPrice,
      rating: 0,
      stock: 0,
      sort: "popularity",
   };
}

function parseStoredFilters(raw: string, maxPrice: number): ProductFilters {
   try {
      const parsed = JSON.parse(raw) as Partial<ProductFilters>;

      return { ...createDefaultFilters(maxPrice), ...parsed, maxPrice };
   } catch {
      return createDefaultFilters(maxPrice);
   }
}

export default function ProductsPage() {
   const [products, setProducts] = useState<Product[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [maxPrice, setMaxPrice] = useState(0);
   const [filters, setFilters] = useState<ProductFilters>({
      q: "",
      categories: [],
      brands: [],
      minPrice: 0,
      maxPrice: 0,
      rating: 0,
      stock: 0,
      sort: "popularity",
   });
   const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([0, 0]);
   const searchParams = useSearchParams();
   const router = useRouter();

   // Load products and restore filters from localStorage
   useEffect(() => {
      const fetchProducts = async () => {
         setLoading(true);
         setError(null);
         try {
            await new Promise((res) => setTimeout(res, 700));
            setProducts(MOCK_PRODUCTS);
            const maxP = MOCK_PRODUCTS.length ? Math.max(...MOCK_PRODUCTS.map((p) => p.price)) : 0;
            setMaxPrice(maxP);
            setTempPriceRange([0, maxP]);

            // Restore filters from localStorage if present
            const saved = localStorage.getItem("productFilters");
            if (saved) {
               const restored = parseStoredFilters(saved, maxP);
               setFilters(restored);
               setTempPriceRange([restored.minPrice, restored.maxPrice]);
            } else {
               // If category in URL, set as initial filter
               const initialCategory = searchParams.get("category")?.toLowerCase() || "";
               setFilters((prev) => ({
                  ...prev,
                  categories: initialCategory ? [initialCategory] : [],
                  maxPrice: maxP,
               }));
               setTempPriceRange([0, maxP]);
            }
         } catch (e) {
            setError("Failed to fetch products");
         } finally {
            setLoading(false);
         }
      };
      fetchProducts();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   // Persist filters to localStorage
   useEffect(() => {
      if (!loading) {
         localStorage.setItem("productFilters", JSON.stringify(filters));
      }
   }, [filters, loading]);

   // Sync category filter to URL
   useEffect(() => {
      if (!loading) {
         const params = new URLSearchParams();
         if (filters.categories[0]) params.set("category", filters.categories[0].toLowerCase());
         router.replace(`/products${params.toString() ? "?" + params.toString() : ""}`);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [filters.categories, loading]);

   const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category))), [products]);
   const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))), [products]);

   // Filtering logic
   const filteredProducts = useMemo(() => {
      return products
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
   }, [products, filters]);

   const activeFiltersCount =
      filters.categories.length + filters.brands.length + (filters.rating > 0 ? 1 : 0) + (filters.stock ? 1 : 0);

   if (loading) {
      return (
         <StoreLayout showHero={false} className="pt-0">
            <div className="container mx-auto px-4 py-12 md:py-16">
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: products.length || 12 }).map((_, i) => (
                     <div key={i} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                        {/* Image */}
                        <div className="aspect-4/5 bg-slate-200 animate-pulse" />

                        {/* Content */}
                        <div className="p-4 space-y-3">
                           <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
                           <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse" />

                           <div className="flex justify-between items-center pt-2">
                              <div className="h-5 w-20 bg-slate-200 rounded animate-pulse" />
                              <div className="h-8 w-8 bg-slate-200 rounded-full animate-pulse" />
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </StoreLayout>
      );
   }

   if (error) {
      return (
         <StoreLayout showHero={false} className="pt-0">
            <div className="flex items-center justify-center min-h-[40vh] text-lg text-red-500">{error}</div>
         </StoreLayout>
      );
   }

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
                        setFilters((prev) => ({
                           ...prev,
                           categories: prev.categories.includes(v) ? prev.categories.filter((x) => x !== v) : [v],
                        }))
                     }
                     onToggleBrand={(v) =>
                        setFilters((prev) => ({
                           ...prev,
                           brands: prev.brands.includes(v) ? prev.brands.filter((x) => x !== v) : [...prev.brands, v],
                        }))
                     }
                     onTempPriceChange={setTempPriceRange}
                     onPriceCommit={(v) => setFilters((prev) => ({ ...prev, minPrice: v[0], maxPrice: v[1] }))}
                     onRatingChange={(v) => setFilters((prev) => ({ ...prev, rating: v }))}
                     onStockChange={(v) => setFilters((prev) => ({ ...prev, stock: v ? 1 : 0 }))}
                     onClear={() => {
                        setTempPriceRange([0, maxPrice]);
                        setFilters((prev) => ({
                           ...prev,
                           q: "",
                           categories: [],
                           brands: [],
                           minPrice: 0,
                           maxPrice,
                           rating: 0,
                           stock: 0,
                           sort: "popularity",
                        }));
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
