"use client";

import { createContext, useContext, ReactNode } from "react";
import { type Product } from "@/lib/mock-data";

interface ProductContextType {
   products: Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ products, children }: { products: Product[]; children: ReactNode }) => {
   return <ProductContext.Provider value={{ products }}>{children}</ProductContext.Provider>;
};

export const useProduct = () => {
   const context = useContext(ProductContext);
   if (!context) throw new Error("useProduct must be used within ProductProvider");
   return context;
};
