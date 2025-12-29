"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { MOCK_PRODUCTS, type Product } from "@/lib/mock-data";

interface ProductContextType {
   products: Product[];
   allProducts: Product[];
   loading: boolean;
   error: string | null;
   filterByCategory: (category: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({
   children,
   initialCategory = "",
}: {
   children: ReactNode;
   initialCategory?: string;
}) => {
   const [allProducts, setAllProducts] = useState<Product[]>([]);
   const [products, setProducts] = useState<Product[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchProducts = async () => {
         try {
            setLoading(true);
            await new Promise((res) => setTimeout(res, 500)); // simulate API
            setAllProducts(MOCK_PRODUCTS);

            // Apply initial category filter if exists
            if (initialCategory) {
               const filtered = MOCK_PRODUCTS.filter((p) => p.category.toLowerCase() === initialCategory.toLowerCase());
               setProducts(filtered);
            } else setProducts(MOCK_PRODUCTS);
         } catch (err) {
            setError("Failed to load products");
         } finally {
            setLoading(false);
         }
      };

      fetchProducts();
   }, [initialCategory]);

   const filterByCategory = (category: string) => {
      if (!category || category.toLowerCase() === "all") {
         setProducts(allProducts);
      } else {
         const filtered = allProducts.filter((p) => p.category.toLowerCase() === category.toLowerCase());
         setProducts(filtered);
      }
   };

   return (
      <ProductContext.Provider value={{ products, allProducts, loading, error, filterByCategory }}>
         {children}
      </ProductContext.Provider>
   );
};

export const useProduct = () => {
   const context = useContext(ProductContext);
   if (!context) throw new Error("useProduct must be used within ProductProvider");
   return context;
};
