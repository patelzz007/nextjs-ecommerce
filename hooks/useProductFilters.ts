"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export type SortOption = "popularity" | "price-asc" | "price-desc" | "rating";

export interface ProductFilters {
  q: string;
  categories: string[];
  brands: string[];
  minPrice: number;
  maxPrice: number;
  rating: number;
  stock: 0 | 1;
  sort: SortOption;
}

export const useProductFilters = (maxProductPrice: number) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial category from URL (case-insensitive)
  const initialCategory = searchParams.get("category")?.toLowerCase() || "";

  const [filters, setFiltersInternal] = useState<ProductFilters>({
    q: "",
    categories: initialCategory ? [initialCategory] : [],
    brands: [],
    minPrice: 0,
    maxPrice: maxProductPrice,
    rating: 0,
    stock: 0,
    sort: "popularity",
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Sync category to URL whenever it changes
  useEffect(() => {
    if (!mounted) return;
    
    const params = new URLSearchParams();
    if (filters.categories[0]) params.set("category", filters.categories[0].toLowerCase());
    router.replace(`/products${params.toString() ? "?" + params.toString() : ""}`);
  }, [filters.categories, router, mounted]);

  const setFilters = useCallback(
    (updates: Partial<ProductFilters>) => {
      setFiltersInternal((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  return [filters, setFilters] as const;
};
